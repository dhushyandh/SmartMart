import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe';

// global vars 
const currency = 'inr';
const deliveryCharge = 50;


// gateway intialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


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

            await userModel.findByIdAndUpdate(orderData.userId, { cartData: {} });

            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {

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

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, orderStatus, updateStatus, verifyStripe }