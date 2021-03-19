const Sequelize = require('sequelize')
const db = require('../db')

const Recording = db.define('recording', {
  duration: {
    type: Sequelize.STRING
  },
  prediction: {
    type: Sequelize.STRING
  },
  confidenceScore: {
    type: Sequelize.STRING
  }
})

module.exports = Recording
