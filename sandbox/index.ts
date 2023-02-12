import 'dotenv/config'
import { client } from '../src/services/redis'

const run = async () => {
	await Promise.all([
		client.hSet('car1', {
			color: 'Red',
			year: 1950
		}),
		client.hSet('car2', {
			color: 'Blue',
			year: 1960
		}),
		client.hSet('car3', {
			color: 'Green',
			year: 1970
		})
	])

	const results = await Promise.all([
		client.hGetAll('car1'),
		client.hGetAll('car2'),
		client.hGetAll('car3')
	])

	console.log(results)
}
run()
