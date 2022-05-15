import paymentServices from './service.js';
import logger from '../utils.js';

const { checkBookingExistence, makePaymentService, checkExistingPayment } = paymentServices;
export default {
  async makePayment(req, res) {
    const { bookingId } = req.body;
    let context = {}
    let HTTP_STATUS_CODE = 200;
    try{
      const isBookingExists = await checkBookingExistence(bookingId);
      if(isBookingExists) {
        const { error } = await checkExistingPayment(bookingId);
        if(error) {
          context = {
            ...context,
            error
          }
          HTTP_STATUS_CODE = 409;
        } else {
          const rows = await makePaymentService(bookingId);
          if(rows.length === 0) {
            context = {
              ...context,
              error: 'Error while making payment'
            }
            HTTP_STATUS_CODE = 503;
          } else {
            const { id } = rows[0];
            context = {
              ...context,
              transactionId: id
            }
          }
        }
      }else {
        logger.error(`Booking is not available for booking reference ${bookingId}`);
        context = {
          ...context,
          error: 'Booking id does not exists'
        }
        HTTP_STATUS_CODE = 404;
      }
      
      res.status(HTTP_STATUS_CODE).json({
        context,
        message: HTTP_STATUS_CODE === 200 ? 'success' : 'failed'
      });
    } catch(error) {
      logger.error(error.message);
      res.status(500).json({
        context: {error: error.message},
        message: 'failed',
      });
    }
  }
}