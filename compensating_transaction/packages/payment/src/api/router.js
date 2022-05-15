import express from "express";
import paymentController from './controller.js';

const router = express.Router();

router.post('/', paymentController.makePayment);

export default router;