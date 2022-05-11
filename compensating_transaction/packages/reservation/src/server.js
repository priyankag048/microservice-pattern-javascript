import express from 'express';
import helmet from 'helmet';
import { database } from '@ct/utilities';
import logger from './utils.js';
import reservationRouter from './api/router.js';

const PORT = process.env.RESERVATION_PORT || 8001;

(async () => {
  await database.initialize();
})();

const app = express();
app.use(express.json());
app.use(helmet());

app.use('/seat', reservationRouter);

app.listen(PORT, () => {
  logger.info('Reservation server started');
});
