import mongoose from 'mongoose'
import productModel from '../models/productModel.js'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import 'dotenv/config'

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

// ---------------- UPLOAD HELPER ----------------
const uploadImage = async (fileName) => {
  const imgPath = path.resolve(`images/${fileName}`)
  const result = await cloudinary.uploader.upload(imgPath, {
    folder: 'products',
  })
  return { url: result.secure_url, public_id: result.public_id }
}

// ---------------- SEED DATA ----------------
const seedProducts = async () => {
  try {
    console.log('🔗 DB connecting...')
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('🧹 Clearing products...')
    await productModel.deleteMany({})

    const products = []

    // ---------- PRODUCT CONFIG ----------
    const productMap = [
      { name: "Women Round Neck Cotton Top", price: 100, cat: "Women", sub: "Topwear", bestseller: true, imgs: ["p_img1.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 200, cat: "Men", sub: "Topwear", bestseller: true, imgs: ["p_img2_1.png", "p_img2_2.png", "p_img2_3.png", "p_img2_4.png"] },
      { name: "Girls Round Neck Cotton Top", price: 220, cat: "Kids", sub: "Topwear", bestseller: true, imgs: ["p_img3.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 110, cat: "Men", sub: "Topwear", bestseller: true, imgs: ["p_img4.png"] },
      { name: "Women Round Neck Cotton Top", price: 130, cat: "Women", sub: "Topwear", bestseller: true, imgs: ["p_img5.png"] },
      { name: "Girls Round Neck Cotton Top", price: 140, cat: "Kids", sub: "Topwear", bestseller: true, imgs: ["p_img6.png"] },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 190, cat: "Men", sub: "Bottomwear", bestseller: false, imgs: ["p_img7.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 140, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img8.png"] },
      { name: "Girls Round Neck Cotton Top", price: 100, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img9.png"] },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 110, cat: "Men", sub: "Bottomwear", bestseller: false, imgs: ["p_img10.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 120, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img11.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 150, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img12.png"] },
      { name: "Women Round Neck Cotton Top", price: 130, cat: "Women", sub: "Topwear", bestseller: false, imgs: ["p_img13.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 160, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img14.png"] },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 140, cat: "Men", sub: "Bottomwear", bestseller: false, imgs: ["p_img15.png"] },
      { name: "Girls Round Neck Cotton Top", price: 170, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img16.png"] },
      { name: "Men Tapered Fit Flat-Front Trousers", price: 150, cat: "Men", sub: "Bottomwear", bestseller: false, imgs: ["p_img17.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 180, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img18.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 160, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img19.png"] },
      { name: "Women Palazzo Pants with Waist Belt", price: 190, cat: "Women", sub: "Bottomwear", bestseller: false, imgs: ["p_img20.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 170, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img21.png"] },
      { name: "Women Palazzo Pants with Waist Belt", price: 200, cat: "Women", sub: "Bottomwear", bestseller: false, imgs: ["p_img22.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 180, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img23.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 210, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img24.png"] },
      { name: "Girls Round Neck Cotton Top", price: 190, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img25.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 220, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img26.png"] },
      { name: "Girls Round Neck Cotton Top", price: 200, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img27.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 230, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img28.png"] },
      { name: "Women Round Neck Cotton Top", price: 210, cat: "Women", sub: "Topwear", bestseller: false, imgs: ["p_img29.png"] },
      { name: "Girls Round Neck Cotton Top", price: 240, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img30.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 220, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img31.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 250, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img32.png"] },
      { name: "Girls Round Neck Cotton Top", price: 230, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img33.png"] },
      { name: "Women Round Neck Cotton Top", price: 260, cat: "Women", sub: "Topwear", bestseller: false, imgs: ["p_img34.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 240, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img35.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 270, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img36.png"] },
      { name: "Women Round Neck Cotton Top", price: 250, cat: "Women", sub: "Topwear", bestseller: false, imgs: ["p_img37.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 280, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img38.png"] },
      { name: "Men Printed Plain Cotton Shirt", price: 260, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img39.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 290, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img40.png"] },
      { name: "Men Round Neck Pure Cotton T-shirt", price: 270, cat: "Men", sub: "Topwear", bestseller: false, imgs: ["p_img41.png"] },
      { name: "Boy Round Neck Pure Cotton T-shirt", price: 300, cat: "Kids", sub: "Topwear", bestseller: false, imgs: ["p_img42.png"] },
      { name: "Kid Tapered Slim Fit Trouser", price: 280, cat: "Kids", sub: "Bottomwear", bestseller: false, imgs: ["p_img43.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 310, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img44.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 290, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img45.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 320, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img46.png"] },
      { name: "Kid Tapered Slim Fit Trouser", price: 300, cat: "Kids", sub: "Bottomwear", bestseller: false, imgs: ["p_img47.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 330, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img48.png"] },
      { name: "Kid Tapered Slim Fit Trouser", price: 310, cat: "Kids", sub: "Bottomwear", bestseller: false, imgs: ["p_img49.png"] },
      { name: "Kid Tapered Slim Fit Trouser", price: 340, cat: "Kids", sub: "Bottomwear", bestseller: false, imgs: ["p_img50.png"] },
      { name: "Women Zip-Front Relaxed Fit Jacket", price: 320, cat: "Women", sub: "Winterwear", bestseller: false, imgs: ["p_img51.png"] },
      { name: "Men Slim Fit Relaxed Denim Jacket", price: 350, cat: "Men", sub: "Winterwear", bestseller: false, imgs: ["p_img52.png"] },
    ]

    for (const item of productMap) {
      const uploadedImages = []
      for (const img of item.imgs) {
        uploadedImages.push(await uploadImage(img))
      }

      products.push({
        name: item.name,
        description: "High quality fashion product",
        price: item.price,
        category: item.cat,
        subCategory: item.sub,
        sizes: ["S", "M", "L", "XL"],
        images: uploadedImages,
        date: Date.now(),
      })
    }

    await productModel.insertMany(products)

    console.log('✅ ALL 52 PRODUCTS SEEDED SUCCESSFULLY')
    process.exit(0)

  } catch (err) {
    console.error('❌ ERROR:', err)
    process.exit(1)
  }
}

seedProducts()
