const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const dbName = process.env.NODE_ENV === 'test' ? `${pkg.name}` : pkg.name
const dbUrl = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
let config
if (process.env.DATABASE_URL) {
  config = {
    logging: false,
    operatorsAliases: false,
    dialect: 'postgres',
    protocol: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
} else {
  config = {
    logging: false,
    operatorsAliases: false
  }
}
const client = new Sequelize(dbUrl, config)
module.exports = client

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => client.close())
}
