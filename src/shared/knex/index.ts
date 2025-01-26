/* eslint-disable @typescript-eslint/no-explicit-any */
import { Knex, knex } from 'knex';
import { dbConfig } from '../../../config/config.json';
import {
  QueryOptions,
} from './knex';
import { convertSnakeKeys, convertKeysToCamelCase } from '../textcase-helper';

class GenericKnex {
  knex: Knex;

  constructor() {
    this.knex = this.createKnexConnection();
  }
  private createKnexConnection = (): Knex => knex(dbConfig);

  generateKnexQuery = async (options: QueryOptions) => {
    const payload = convertSnakeKeys(options);
    const {
      table,
      column,
      where = {},
      order_by = { column: 'created_at', order: 'desc' },
      update,
      insert,
      where_in,
      where_not_in = null,
      on_conflict,
      del = false,
      limit = null,
      offset = null,
      group_by,
      count = null,
      distinct_count = null,
      where_raw = '',
      search,
      where_between,
      or_where_between,
      and_where,
      where_not,
      sum,
      or_where,
    } = payload;

    let query = this.knex(table);
    if (insert) {
      query = query.insert(insert);
    }
    if (column) {
      query = query.select(column);
    }
    if (Object.keys(where).length > 0) {
      query = query.where(where);
    }
    if (update) {
      query = query.update(update);
    }
    if (distinct_count) {
      query.countDistinct({ total_count: distinct_count });
    }
    if (where_in) {
      if (Array.isArray(where_in)) {
        where_in.forEach(({ column, values }) => {
          query = query.whereIn(column, values);
        });
      } else {
        const { column, values } = where_in;
        query = query.whereIn(column, values);
      }
    }
    if (where_not_in) {
      const { column, values } = where_not_in;
      query = query.whereNotIn(column, values);
    }
    if (where_between) {
      const { column, values } = where_between;
      query = query.whereBetween(column, values);
    }
    if (or_where_between) {
      const { column, values } = or_where_between;
      query = query.orWhereBetween(column, values);
    }
    if (and_where) {
      query = query.andWhere(and_where);
    }
    if (or_where) {
      query = query.orWhere(or_where);
    }
    if (where_not) {
      query = query.whereNot(where_not);
    }
    if (del) {
      query = query.del();
    }
    if (on_conflict) {
      const { column, merge } = on_conflict;
      query = query.onConflict(column).merge(merge);
    }
    if (group_by) {
      query = query.groupBy(group_by);
    }
    if (count) {
      query.count({ total_count: count });
    }
    if (limit && (offset === 0 || offset)) {
      query = query.limit(limit).offset(offset);
    }
    if (order_by) {
      const { column, order } = order_by;
      query = query.orderBy(column, order);
    }
    if (where_raw) {
      query = query.whereRaw(where_raw);
    }
    if (search) {
      const { columns, value } = search;
      query.where(function () {
        columns.forEach((column: string) => {
          this.orWhere(column, 'like', `%${value}%`);
        });
      });
    }
    if (sum) {
      query = query.sum({ sum: sum });
    }

    try {
      const response = await query;
      return convertKeysToCamelCase(response);
    } catch (error: any) {
      throw new Error(`Knex query error: ${error.message}`);
    }
  };
}

const instance = new GenericKnex();
export default instance;
