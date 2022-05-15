import { database } from '@ct/utilities';

export default {
  async checkBookingExistence(bookingId) {
    const query = 'SELECT id, seat_id FROM booking WHERE id=$1';
    const values = [bookingId];
    const rows = await database.execute(query, values);
    if(rows.length === 0) {
      return false;
    }
    return true;
  },
  async checkExistingPayment(bookingId) {
    const paymentConfirmationQuery = 'SELECT id FROM payment WHERE booking_id=$1';
    const confirmationRows = await database.execute(paymentConfirmationQuery, [bookingId]);
    if(confirmationRows.length === 0 ) {
      return {
        error: ''
      }
    }
    return {
      error: `Payment already done for booking reference ${bookingId}`
    }
  },
  makePaymentService(bookingId) {
    const randomNumber = parseInt((Math.random() + 1) * 2, 10);
    if (randomNumber === 2) {
      throw new Error('payment api fails');
    }
    const query = 'INSERT INTO payment(confirmed, booking_id) VALUES($1, $2) RETURNING id';
    const values = [true, bookingId];
    return database.execute(query, values);
  }
} 