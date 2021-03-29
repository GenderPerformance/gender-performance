const Queue = require('bull')

if (
  process.env.PGHOST === 'localhost' ||
  (process.env.NODE_ENV !== 'production' && !process.env.TRAVIS)
) {
  require('../../secrets')
}
//create the queue for MLmodel
const MLmodelQueue = new Queue('MLmodel', process.env.REDIS_URL)
const maxJobsPerWorker = 1

module.exports = 'queue'
