import utils from '../utilities.js';
import config from '../config.js';

const { httpProvider, logger } = utils;
const { RESERVATION_API, PAYMENT_API } = config;

export default {
  getAvailableSeats() {
    return httpProvider(`${RESERVATION_API}availability`, { 
      method: 'GET',
      responseType: 'json'
    });
  },
  async createReservation(fullname, seatId ) {
    try{
      return await httpProvider(`${RESERVATION_API}reservation`, { 
        method: 'POST',
        json: {fullname, seatId},
        responseType: 'json'
      });
    } catch(error) {
      return error.response;
    }
  },
  async paymentService(bookingId) {
    try {
      return await httpProvider(`${PAYMENT_API}payment`, {
        method: 'POST',
        json: {bookingId},
        responseType: 'json'
      });
    } catch(error) {
      return error.response;
    }
  },
  removeReservation(bookingId) {
    return httpProvider(`${RESERVATION_API}reservation/${bookingId}`, {
      method: 'DELETE',
      responseType: 'json'
    });
  }
}