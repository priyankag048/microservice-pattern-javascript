import express from 'express';
import helmet from 'helmet';
import utils from './utilities.js';
import router from './api/router.js';

const PORT = process.env.API_GATEWAY_PORT || 8003;
const { logger } = utils;

const app = express();
app.use(express.json());
app.use(helmet());

app.get('/healthcheck', (_req, res) => {
  res.status(200).json({
    message: 'API gateway is healthy'
  });
})
app.use('/', router);

app.listen(PORT, () => {
  logger.info('Server started');
});
