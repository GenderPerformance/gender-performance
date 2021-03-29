const MLmodelQueue = require('./queue')

console.log(MLmodelQueue)
const workers = process.env.WEB_CONCURRENCY || 2
MLmodelQueue.process(maxJobsPerWorker, async job => {})
