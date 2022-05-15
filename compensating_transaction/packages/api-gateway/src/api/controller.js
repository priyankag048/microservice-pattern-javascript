import services from './service.js';
import config from '../config.js';
import utils from '../utilities.js';

const { HTTP_STATUS } = config;
const { logger } = utils;

const getAvailableSeats = async (_req, res) => {
  try{
    const { body, statusCode } = await services.getAvailableSeats();
    console.log(body);
    res.status(statusCode).json(body);
  }catch(error) {
    res.status(500).json({
      context: error.message,
      message: 'failed',
    });
  }
};

const startPaymentMethod = async (bookingReference) => {
  const {body, statusCode} = await services.paymentService(bookingReference);
  if(statusCode !== HTTP_STATUS.OK) {
    logger.error(`Payment api fails with statusCode ${statusCode}`);
    await services.removeReservation(bookingReference);
  }
  return {
    body,
    statusCode
  }
};

const createReservation = async (req, res) => {
  const { fullname, seatId } = req.body;
  let body;
  let statusCode;
  let context = {};
  try{
    ({ body, statusCode } = await services.createReservation(fullname, seatId));
    if(statusCode === HTTP_STATUS.OK) {
      const { context: { bookingReference, seatNumber }} = body;
      context = { ...context, bookingReference, seatNumber };
      ({ body, statusCode } = await startPaymentMethod(bookingReference));
    }
    const details = { context: {...context, ...body.context}, message: body.message }
    res.status(statusCode).json(details);
  }catch(error) {
    res.status(500).json({
      context: error.message,
      message: 'failed',
    });
  }
}

export default {
  getAvailableSeats,
  createReservation
}