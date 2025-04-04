import Subscription  from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if user is the same as the one one in the token
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to view this subscription');
            error.statusCode = 403;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Subscriptions fetched successfully',
            data: subscriptions,
        });
    } catch(e){
        next(e);
    }
}
