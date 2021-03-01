/* eslint-disable linebreak-style */
import './loadenv'
import { getStreamClient, Timer, runBenchmark } from './utils'
import chunkify from '../utils/chunk'

let client = getStreamClient()
const t = new Timer()
const followers = 20000
let targetID = `nick${followers}`

// nick is very popular
let feed = client.feed('user', targetID)

const follows = []

for (let i = 0; i < followers; i++) {
	const source = `timeline:${i}`
	const target = `user:${targetID}`
	follows.push({ source, target })
}

async function prepareBenchmark() {
	// setup the follow relationships
	for (const group of chunkify(follows, 1000)) {
		await client.followMany(group)
	}
	console.log(`created ${follows.length} follow relationships`)
	// listen to changes in the last feed
	const connected = await client.feed('timeline', followers - 1).subscribe(data => {
		if (data.new && data.new[0]) {
			t.stop('fanout and realtime', data.new[0].foreign_id)
		}
	})
	console.log(connected)
}

async function benchmarkFanout(n) {
	let activities = []
	for (let x = 0; x < process.env.CONCURRENCY; x++) {
		const activity = {
			foreign_id: `test:${n}`,
			actor: 'user:1',
			verb: 'tweet',
			object: 'tweet:1',
		}
		activities.push(activity)
	}
	console.log(`inserting ${activities.length} at once`)
	t.start('fanout and realtime', `test:${n}`)
	let response = await feed.addActivities(activities)

	return response
}

async function run() {
	await prepareBenchmark()
	console.log('starting benchmark now')
	await runBenchmark(benchmarkFanout, process.env.REPETITIONS, 1)
	setTimeout(() => {
		t.summarize()
	}, 12000)
}

run()
	.then(() => {
		console.log('done')
	})
	.catch(err => {
		console.log('err', err)
	})
