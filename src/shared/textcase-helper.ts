/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';

function convertKeysToCamelCase(obj: any): any {
  if (!_.isObject(obj) || obj === null) {
    return obj;
  }
  if (_.isArray(obj)) {
    return _.map(obj, convertKeysToCamelCase);
  }
  if (_.isDate(obj)) {
    return obj;
  }
  return _.mapValues(
    _.mapKeys(obj, (value, key) =>
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    ),
    convertKeysToCamelCase,
  );
}

function convertToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function convertSnakeKeys(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return convertSnakeKeys(item);
      } else if (typeof item === 'string') {
        return convertToSnakeCase(item);
      } else {
        return item;
      }
    });
  } else if (typeof data === 'object' && data !== null) {
    const newObj: { [key: string]: any } = {};
    for (const key in data) {
      newObj[convertToSnakeCase(key)] = convertSnakeKeys(data[key]);
    }
    return newObj;
  } else {
    return data;
  }
}

export {
  convertKeysToCamelCase,
  convertToSnakeCase,
  convertSnakeKeys,
};
