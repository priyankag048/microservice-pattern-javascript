import pg from 'pg';
import config from './config.js';
import loggerService from './logger.js';

const { Pool } = pg;
const { DATABASE_CONFIG } = config;
const logger = loggerService('database');
class Database {
  #pool;
  constructor() {
    this.#pool = new Pool(DATABASE_CONFIG);
  }
  async initialize() {
    try {
      await this.#pool.connect();
    } catch (error) {
      logger.error('Error while connecting to database: ', error);
      process.exit(1);
    }
  }
  async execute(query, values) {
    let rows;
    if (values) {
      ({ rows } = await this.#pool.query(query, values));
    } else {
      ({ rows } = await this.#pool.query(query));
    }
    return rows;
  }
}

export default new Database();
