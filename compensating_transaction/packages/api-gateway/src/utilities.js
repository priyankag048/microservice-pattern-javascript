import got from 'got';
import { loggingService } from '@ct/utilities';

export default {
  logger: loggingService('@ct/api-gateway'),
  httpProvider(url, options) {
    return got(url, options);
  }
}