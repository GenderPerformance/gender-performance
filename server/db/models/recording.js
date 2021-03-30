const Sequelize = require('sequelize')
const db = require('../db')

const Recording = db.define('recording', {
  maleConfidence: {
    type: Sequelize.FLOAT
  },
  femaleConfidence: {
    type: Sequelize.FLOAT
  },
  url: {
    type: Sequelize.STRING
  }
})

module.exports = Recording
