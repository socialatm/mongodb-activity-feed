import Mocha from 'mocha'
import { dropDBs } from './test/utils.js'

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
	//XXX: drop all data before running tests
	await dropDBs()
})
