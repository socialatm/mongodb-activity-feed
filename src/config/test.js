/* eslint-disable linebreak-style */
module.exports = {
	database: {
		uri: 'mongodb://localhost:27017/test',
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	redis: {
		uri: 'redis://localhost:6379/10',
	},
	logger: {
		level: 'debug',
	},
}
