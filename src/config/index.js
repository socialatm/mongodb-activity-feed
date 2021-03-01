/* eslint-disable linebreak-style */
const config = require('./dev.js')
const _default = {}
module.exports = Object.assign({ env: process.env.NODE_ENV }, _default, config)
