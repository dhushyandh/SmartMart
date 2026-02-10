import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        default: '',
    },
    author: {
        type: String,
        default: '',
    },
    edition: {
        type: String,
        default: '',
    },
    semester: {
        type: String,
        default: '',
    },
    publisher: {
        type: String,
        default: '',
    },
    sizes: {
        type: Array,
        required: true,
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Number,
        required: true,
    },
    reviews: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                },
                name: {
                    type: String,
                    default: '',
                },
                rating: {
                    type: Number,
                    default: 0,
                },
                comment: {
                    type: String,
                    default: '',
                },
                date: {
                    type: Number,
                    default: () => Date.now(),
                },
            },
        ],
        default: [],
    },
})


const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;