import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
    },

    price : {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be less than 0']
    },

    currency : {
        type: String,
        required: [true, 'Currency is required'],
        trim: true,
        enum: ['USD', 'EUR', 'GBP', 'NGN'],
        maxLength: [3, 'Currency cannot be more than 3 characters'],
        uppercase: true,
        default: 'NGN'
    },

    frequency : {
        type: String,
        trim: true,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        lowercase: true,
        default: 'monthly'
    },

    category : {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: ['sports', 'entertainment', 'news', 'education', 'technology', 'politics', 'health', 'finance', 'lifestyle', 'food'],
        lowercase: true
    },

    paymentMethod : {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
        enum: ['credit card', 'debit card', 'bank transfer', 'cash', 'crypto'],
        lowercase: true
    },

    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },

    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        },
        default: Date.now
    },

    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate
            },
            message: 'Renewal date must be after the past'
        },
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Auto calculate renewal date if missing
subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status if renewal date has passed
    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }
    
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;