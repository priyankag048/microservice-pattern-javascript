import express from 'express';
import helmet from 'helmet';
import { database } from '@ct/utilities';
import logger from './utils.js';
import paymentRouter from './api/router.js';

const PORT = process.env.PAYMENT_PORT || 8002;

(async () => {
  await database.initialize();
})();

const app = express();
app.use(express.json());
app.use(helmet());

app.get('/healthcheck', (_req, res) => {
  res.status(200).json({
    message: 'Payment service is healthy'
  });
})
app.use('/payment', paymentRouter);

app.listen(PORT, () => {
  logger.info('Payment server started');
});
