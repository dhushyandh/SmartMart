import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import sendEmail from "../utils/sendEmail.js";

// global vars 
const currency = 'inr';
const deliveryCharge = 50;

const decrementStockForItems = async (items = []) => {
    if (!items.length) return;

    for (const item of items) {
        const productId = item?._id || item?.productId || item?.id;
        const quantity = Number(item?.quantity) || 0;
        if (!productId || quantity <= 0) continue;

        const product = await productModel.findById(productId).select('stock');
        if (!product) continue;

        const nextStock = Math.max(0, (Number(product.stock) || 0) - quantity);
        await productModel.findByIdAndUpdate(productId, { $set: { stock: nextStock } });
    }
};

const formatOrderEmail = ({ order, user }) => {
    const lines = (order.items || []).map((item) => {
        const title = item.name || 'Item';
        const qty = item.quantity || 1;
        const size = item.size ? ` (${item.size})` : '';
        const price = typeof item.price === 'number' ? `₹${item.price}` : '';
        return `- ${title}${size} x ${qty} ${price}`.trim();
    });

    const address = order.address || {};
    const addressLine = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.zipcode,
    ].filter(Boolean).join(', ');

    return `
Hello ${user?.name || 'Customer'},

Your order has been placed successfully.

Order details:
${lines.join('\n')}

Total Amount: ₹${order.amount}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.payment ? 'Paid' : 'Pending'}

Delivery Address:
${address.firstName || ''} ${address.lastName || ''}
${addressLine}
${address.phone || ''}

Thank you for shopping with SmartMart.
`;
};


// gateway intialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,

})


// Placing orders using cod method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            address
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } })

        try {
            const user = await userModel.findById(userId).select('name email');
            if (user?.email) {
                await sendEmail({
                    to: user.email,
                    subject: 'SmartMart Order Confirmation',
                    text: formatOrderEmail({ order: newOrder, user }),
                });
            }
        } catch (emailError) {
            console.log('Order email failed:', emailError?.message || emailError);
        }
        res.json({ success: true, message: "Order Placed Successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}
// Placing orders using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity
        }));

        lineItems.push({
            price_data: {
                currency: 'inr',
                product_data: { name: 'Delivery Charges' },
                unit_amount: 50 * 100,
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            mode: 'payment',
            line_items: lineItems,
            metadata: {
                userId,
                items: JSON.stringify(items),
                amount,
                address: JSON.stringify(address)
            }
        });

        res.json({ success: true, sessionUrl: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const orderData = {
                userId: session.metadata.userId,
                items: JSON.parse(session.metadata.items),
                amount: session.metadata.amount,
                address: JSON.parse(session.metadata.address),
                paymentMethod: "STRIPE",
                payment: true,
                date: Date.now()
            };

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            await decrementStockForItems(orderData.items || []);

            await userModel.findByIdAndUpdate(orderData.userId, { cartData: {} });

            try {
                const user = await userModel.findById(orderData.userId).select('name email');
                if (user?.email) {
                    await sendEmail({
                        to: user.email,
                        subject: 'SmartMart Order Confirmation',
                        text: formatOrderEmail({ order: newOrder, user }),
                    });
                }
            } catch (emailError) {
                console.log('Order email failed:', emailError?.message || emailError);
            }

            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID required' });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        if (!order.payment) {
            await orderModel.findByIdAndUpdate(orderId, { $set: { payment: true } });
            await decrementStockForItems(order.items || []);
        }

        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {

    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
            address
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
            notes: {
                userId,
                items: JSON.stringify(items),
                amount,
                address: JSON.stringify(address)
            }
        };
        await razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: err.message });
            } else {
                try {
                    userModel.findById(userId).select('name email').then((user) => {
                        if (user?.email) {
                            sendEmail({
                                to: user.email,
                                subject: 'SmartMart Order Confirmation',
                                text: formatOrderEmail({ order: newOrder, user }),
                            });
                        }
                    });
                } catch (emailError) {
                    console.log('Order email failed:', emailError?.message || emailError);
                }

                const publicKey = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID || (razorpayInstance && razorpayInstance.key_id) || '';
                console.log('Returning Razorpay public key (may be empty):', !!publicKey);
                if (!publicKey) console.warn('Razorpay public key not found in environment variables');

                res.json({ 
                    success: true, 
                    orderId: order.id, 
                    amount: order.amount,
                    currency: options.currency,
                    order,
                    key: publicKey,
                    orderDbId: newOrder._id
                });
            }
        });
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// All orders data for Frontend
const userOrders = async (req, res) => {

    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// update order status from admin panel
const orderStatus = async (req, res) => {

}
// update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { $set: { status } });
        res.json({ success: true, message: "Status Updated Successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, orderStatus, updateStatus, verifyStripe, verifyRazorpay }