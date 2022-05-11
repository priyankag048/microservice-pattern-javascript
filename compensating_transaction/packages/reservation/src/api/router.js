import express from 'express';
import reservationController from './controller.js';

const router = express.Router();
const { getAvailableSeats, createSeatReservation } = reservationController;

router.get('/availability', getAvailableSeats);

router.post('/booking', createSeatReservation);

export default router;
