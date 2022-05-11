import services from './service.js';
import logger from '../utils.js';

const {
  getAvailableSeats, checkSeatAvailability, updateSeatReservation, createReservation,
} = services;

export default {
  async getAvailableSeats(_req, res) {
    try {
      const seatDetails = await getAvailableSeats();
      res.status(200).json({
        seatDetails,
        message: 'success',
      });
    } catch (error) {
      res.status(500).json({
        context: error.message,
        message: 'failed',
      });
    }
  },
  async createSeatReservation(req, res) {
    const { fullname, seatId } = req.body;
    try {
      let context = {};
      let HTTP_STATUS_CODE = 200;
      const { isSeatAvailable, seatNumber, error: seatAvailabilityError } = await checkSeatAvailability(seatId);
      if (isSeatAvailable) {
        await updateSeatReservation(seatId, true);
        logger.info(`Seat reservation successful for seat number ${seatNumber}`);
        const { error, bookingReference } = await createReservation(fullname, seatId);
        if (error) {
          logger.error(error);
          context = {
            ...context,
            seatNumber,
            error,
          };
          HTTP_STATUS_CODE = 503;
          await updateSeatReservation(seatId, false);
          logger.info(`Removal of seat reservation successful for seat number ${seatNumber}`);
        } else {
          logger.info(`Reservation created with booking reference ${bookingReference}`);
          context = {
            ...context,
            seatNumber,
            bookingReference,
          };
        }
      } else {
        logger.error(seatAvailabilityError);
        context = {
          ...context,
          seatNumber,
          error: seatAvailabilityError,
        };
        HTTP_STATUS_CODE = 409;
      }
      res.status(HTTP_STATUS_CODE).json({
        context,
        message: HTTP_STATUS_CODE === 200 ? 'success' : 'failed',
      });
    } catch (error) {
      res.status(500).json({
        context: error.message,
        message: 'failed',
      });
    }
  },
};
