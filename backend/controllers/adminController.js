import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

const getAdminOverview = async (req, res) => {
  try {
    const [productsCount, ordersCount, usersCount, outOfStockCount, totalAmountAgg] = await Promise.all([
      productModel.countDocuments({}),
      orderModel.countDocuments({}),
      userModel.countDocuments({}),
      productModel.countDocuments({ stock: { $lte: 0 } }),
      orderModel.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalAmount = totalAmountAgg?.[0]?.total || 0;

    return res.json({
      success: true,
      stats: {
        totalAmount,
        productsCount,
        ordersCount,
        usersCount,
        outOfStockCount
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { getAdminOverview };
