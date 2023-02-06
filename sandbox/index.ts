import 'dotenv/config'
import { client } from '../src/services/redis'

const run = async () => {
	await client.hSet('car', {
		color: 'Red',
		year: 1950,
		engine: {
			cylinders: 8
		},
		owner: '',
		service: ''
	})

	const car = await client.hGetAll('car')
	const noCar = await client.hGetAll('noCar')

	if (car) {
		console.log('car', car)
	}

	if (Object.keys(noCar).length === 0) {
		console.log('noCar', noCar)
	}
}
run()
