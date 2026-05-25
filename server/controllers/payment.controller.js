import crypto from 'crypto';
import razorpay from '../Services/razorpay.service.js';
import User from '../models/user.model.js'
import Payment from '../models/payment.model.js';

export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }


        const options = {
            amount: amount * 100,  // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.status(200).json(order);


    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message:
                "Server error while creating payment order"
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {

        const { razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body


        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.status = "paid";
        await payment.save();

        const updatedUser = await User.findByIdAndUpdate
            (payment.userId,
                {
                    $inc: { credits: payment.credits }
                }, {
                new: true
            }
            );


        return res.status(200).json({
            message:
                "payment verified and credits added successfully",
            user: updatedUser
        })

    }


    catch (err) {
        console.log(err);
        res.status(500).json({
            message:
                "Server error while verifying payment order"
        })
    }

}