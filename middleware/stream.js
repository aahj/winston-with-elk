const { Writable } = require('stream');
// const logger = require('../src/utils/Logger');
const logger = require('../src/logging/log');

class Mystream extends Writable {
  write(message) {
    const findIndex = message.search('userAgent');
    const firstHalf = message.slice(0, findIndex);
    const secondHalf = message.slice(findIndex);

    const splitFirstHalfMessage = firstHalf.split(',');
    const objectOfResponse = {};
    splitFirstHalfMessage.forEach((val) => {
      if (val !== ' ') {
        const key = val.split(':')[0].trim();
        const value = val.split(':')[1].trim();
        objectOfResponse[key] = value;
      }
    });
    const key = secondHalf.split(':')[0].trim();
    const value = secondHalf.split(':')[1].trim();
    objectOfResponse[key] = value;
    logger.child(objectOfResponse);
  }
}
module.exports = Mystream;
