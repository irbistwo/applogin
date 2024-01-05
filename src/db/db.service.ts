import { Injectable } from '@nestjs/common';
import { dbConfig } from './db.config';
import { Pool } from 'pg';

@Injectable()
export class DbService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool(dbConfig);
  }

  async query(queryText: string, values?: any[]): Promise<any> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (e) {
      throw e;
    } finally {
      client.release();
    }
  }

  async executeSQL(queryText: string, values?: any[]): Promise<any> {
    const client = await this.pool.connect();

    try {
      await client.query(queryText, values);
      await client.query('COMMIT');
      return { message: 'OK' };
    } catch (e) {
      await client.query('ROLLBACK');
      return { error: e.toString() };
      // throw e
    } finally {
      client.release();
    }
  }
}
