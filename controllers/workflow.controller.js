import { createRequire } from 'module';
import Subscription from '../models/subscription.model';
import dayjs from 'dayjs';

const REMINDERS = [7, 5, 2, 1]; // days before renewal date
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') {
        return
        //return res.status(404).json({ message: 'Subscription not found or inactive' });
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log("Renewal date have passed")
        return
        //return res.status(400).json({ message: 'Subscription is already expired' });
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            //const label = `${daysBefore}-day reminder`;
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);           
        }

        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label}`);
    await context.sleepUntilReminder(label, date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // Send email
    })
}