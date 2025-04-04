import { Router } from 'express';
import authorize from  "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptioRouter = Router();

subscriptioRouter.get('/', (req, res) => { res.send('Get all subscription') });

subscriptioRouter.get('/:id', (req, res) => { res.send('Get subscription details') });

subscriptioRouter.post('/', authorize, createSubscription);

subscriptioRouter.put('/:id', authorize, (req, res) => { res.send('Update subscription') });

subscriptioRouter.delete('/:id', authorize, (req, res) => { res.send('Delete subscription') });

subscriptioRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptioRouter.put('/:id/cancel', authorize, (req, res) => { res.send('Cancel subscription') });

subscriptioRouter.get('/upcoming-renewals', authorize, (req, res) => { res.send('Get upcoming renewals') });

export default subscriptioRouter;