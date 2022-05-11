import { database } from '@ct/utilities';

export default {
  async getAvailableSeats() {
    const query = 'SELECT id, seat_number, booked FROM seat';
    return database.execute(query);
  },
  async checkSeatAvailability(seatId) {
    const response = {
      error: '',
      seatNumber: '',
      isSeatAvailable: false,
    };
    const query = 'SELECT seat_number, booked FROM seat WHERE id=$1';
    const values = [seatId];
    const rows = await database.execute(query, values);
    if (rows.length === 0) {
      return {
        ...response,
        error: 'Invalid seat number',
      };
    }
    const { booked, seat_number: seatNumber } = rows[0];
    if (booked) {
      return {
        ...response,
        seatNumber,
        error: 'Seat is not available. Please try with some other seat number',
      };
    }
    return {
      ...response,
      seatNumber,
      isSeatAvailable: true,
    };
  },
  async updateSeatReservation(seatId, reserve) {
    const query = 'UPDATE seat SET booked=$1 WHERE id=$2';
    const values = [reserve, seatId];
    return database.execute(query, values);
  },
  async createReservation(name, seatId) {
    const response = {
      error: '',
      bookingReference: '',
    };
    try {
      const randomNumber = parseInt((Math.random() + 1) * 2, 10);
      if (randomNumber === 2) {
        throw new Error('createReservation api fails');
      }
      const query = 'INSERT INTO booking(name, seat_id) VALUES($1,$2) RETURNING id';
      const values = [name, seatId];
      const rows = await database.execute(query, values);
      if (rows.length === 0) {
        return {
          ...response,
          error: 'Error while creating reservation',
        };
      }
      const { id: bookingReference } = rows[0];
      return {
        ...response,
        bookingReference,
      };
    } catch (error) {
      return {
        ...response,
        error: error?.message || 'Error while creating reservation',
      };
    }
  },
};
