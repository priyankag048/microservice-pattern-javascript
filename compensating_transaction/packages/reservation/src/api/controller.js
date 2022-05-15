import services from './service.js';
import logger from '../utils.js';

const {
  getAvailableSeats,
  checkSeatAvailability, 
  updateSeatReservation, 
  createReservation, 
  removeReservation
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
      logger.error(error.message);
      res.status(500).json({
        context: error.message,
        message: 'failed',
      });
    }
  },
  async removeSeatReservation(req, res) {
    const { id } = req.params;
    let context = {};
    try{
      const rows = await removeReservation(id);
      if(rows.length === 0) {
        logger.info(`No Reservation available under booking reference ${id}`);
        context = {
          ...context,
          message: `No Reservation available under booking reference ${id}`
        }
      } else {
        const { seat_id: seatId } = rows[0];
        const [row] = await updateSeatReservation(seatId, false);
        logger.info(`Removal of seat reservation successful for seat number ${row.seat_number}`);
        context = {
          ...context,
          message: `Removal of seat reservation successful for seat number ${row.seat_number}`
        }
      }
      res.status(200).json({
        context,
        message: 'success'
      });
    }catch (error) {
      res.status(500).json({
        context: error.message,
        message: 'failed'
      });
    }
  }
};
