import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

// function for add product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
            department,
            author,
            edition,
            semester,
            publisher
        } = req.body;
        

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return ({ url: result.secure_url, public_id: result.public_id })
            })
        )

        const productData = {
            name,
            description,
            price: price ? Number(price) : 0,
            category,
            subCategory,
            department: department || category,
            author: author || '',
            edition: edition || '',
            semester: semester || '',
            publisher: publisher || '',
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            images: imagesUrl,
            date: Date.now(),
        }
        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added Successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for list products
const listProducts = async (req, res) => {

    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product
const singleProduct = async (req, res) => {

    try {
        const { productId } = req.body;
        const product = await productModel.findById(req.body.id);
        res.json({ success: true, product })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, department, author, edition, semester, publisher, bestseller } = req.body;
        const updateData = {};

        if (typeof name !== 'undefined') updateData.name = name;
        if (typeof description !== 'undefined') updateData.description = description;
        if (typeof price !== 'undefined') updateData.price = Number(price) || 0;
        if (typeof category !== 'undefined') updateData.category = category;
        if (typeof subCategory !== 'undefined') updateData.subCategory = subCategory;
        if (typeof department !== 'undefined') updateData.department = department;
        if (typeof author !== 'undefined') updateData.author = author;
        if (typeof edition !== 'undefined') updateData.edition = edition;
        if (typeof semester !== 'undefined') updateData.semester = semester;
        if (typeof publisher !== 'undefined') updateData.publisher = publisher;
        if (typeof bestseller !== 'undefined') updateData.bestseller = bestseller === 'true' || bestseller === true;

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length > 0) {
            const imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return ({ url: result.secure_url, public_id: result.public_id })
                })
            )
            updateData.images = imagesUrl;
        }

        const product = await productModel.findByIdAndUpdate(id, updateData, { new: true });

        return res.json({ success: true, message: "Product Updated Successfully", product });
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// function for add review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId) {
            return res.json({ success: false, message: 'Product ID required' });
        }

        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const user = await userModel.findById(req.body.userId).select('name');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const review = {
            userId: req.body.userId,
            name: user.name,
            rating: numericRating,
            comment: comment || '',
            date: Date.now(),
        };

        const product = await productModel.findByIdAndUpdate(
            productId,
            { $push: { reviews: review } },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        return res.json({ success: true, message: 'Review added', reviews: product.reviews });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// function for list reviews (admin)
const listReviews = async (req, res) => {
    try {
        const products = await productModel
            .find({ reviews: { $exists: true, $ne: [] } })
            .select('name reviews');

        const reviews = products.flatMap((product) =>
            (product.reviews || []).map((review) => ({
                productId: product._id,
                productName: product.name,
                reviewId: review._id,
                userId: review.userId,
                name: review.name,
                rating: review.rating,
                comment: review.comment,
                date: review.date,
            }))
        );

        return res.json({ success: true, reviews });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// function for delete review (admin)
const deleteReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.body;

        if (!productId || !reviewId) {
            return res.json({ success: false, message: 'Product ID and Review ID required' });
        }

        const product = await productModel.findByIdAndUpdate(
            productId,
            { $pull: { reviews: { _id: reviewId } } },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        return res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// function for remove product
const removeProduct = async (req, res) => {

    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProducts, singleProduct, updateProduct, addReview, listReviews, deleteReview, removeProduct }