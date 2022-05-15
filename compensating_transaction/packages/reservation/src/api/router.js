import express from 'express';
import reservationController from './controller.js';

const router = express.Router();
const { getAvailableSeats, createSeatReservation, removeSeatReservation } = reservationController;

router.get('/availability', getAvailableSeats);
router.post('/reservation', createSeatReservation);
router.delete('/reservation/:id', removeSeatReservation);

export default router;
