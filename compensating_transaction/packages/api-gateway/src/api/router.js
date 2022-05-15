import express from "express";
import controller from './controller.js';

const { getAvailableSeats, createReservation } = controller;

const router = express.Router();

router.get('/seat', getAvailableSeats);

router.post('/reservation', createReservation)

export default router;