import mongoose from 'mongoose'
mongoose.Promise = global.Promise

mongoose.connect(
	'mongodb://localhost:27017/test',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
)
mongoose.connection
	.once('open', () => {
		console.log('Connection to DB established')
	})
	.on('error', error => {
		console.warn('Warning', error)
	})
