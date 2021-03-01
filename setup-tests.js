/* eslint-disable linebreak-style */
import Mocha from 'mocha'
import config from './src/config'
import logger from './src/utils/logger'
import { dropDBs } from './test/utils'

function wrapMocha(onPrepare, onUnprepare) {
	// Monkey-patch run method
	const run = Mocha.prototype.run

	//XXX: using function syntax instead of fat-arrow syntax
	//     to avoid implicit binding of 'this'
	Mocha.prototype.run = function(done) {
		const self = this
		onPrepare()
			.then(() => {
				//XXX: ditto
				run.call(self, function() {
					if (typeof onUnprepare === 'function') {
						onUnprepare.apply(this, arguments)
					}
					done.apply(this, arguments)
				})
			})
			.catch(err => {
				if (err instanceof Error) {
					console.error(err.stack)
				}
				process.exit(1)
			})
	}
}

wrapMocha(async () => {
	if (!config.database.uri)
		throw new Error('Missing MongoDB connection string. Check config')
	if (!config.redis.uri)
		throw new Error('Missing Redis connection string. Check config')
	if (
		!config.database.uri.includes('localhost') &&
		!config.database.uri.includes('127.0.0.1')
	)
		throw new Error(
			'MongoDB connection string contains non-local address. For safety reasons test suite can only connect to local databases. Check config',
		)
	if (
		!config.redis.uri.includes('localhost') &&
		!config.redis.uri.includes('127.0.0.1')
	)
		throw new Error(
			'Redis connection string contains non-local address. For safety reasons test suite can only connect to local databases. Check config',
		)

	//XXX: drop all data before running tests
	await dropDBs()
})
