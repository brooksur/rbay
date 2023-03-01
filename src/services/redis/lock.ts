import { randomBytes } from 'crypto'
import { client } from './client'

type Callback = (redisClient: Client, signal: any) => any

export const withLock = async (key: string, cb: Callback) => {
	// init some vars
	const delayms = 100
	const expMs = 2000
	const maxTries = 20
	const token = randomBytes(6).toString('hex')
	const lockKey = `lock:${key}`

	let tries = 0
	while (tries < maxTries) {
		tries++

		const aquired = await client.set(lockKey, token, {
			NX: true,
			PX: expMs
		})

		if (!aquired) {
			await pause(delayms)
			continue
		}

		await client.unlock(lockKey, token)

		try {
			const signal = { expired: false }

			setTimeout(() => {
				signal.expired = true
			}, expMs)

			const proxiedClient = buildClientProxy(expMs)

			return await cb(proxiedClient, signal)
		} finally {
			await client.unlock(lockKey, token)
		}
	}
}

type Client = typeof client

const buildClientProxy = (timeoutMs: number) => {
	const startTime = Date.now()

	const handler = {
		get(target: Client, prop: keyof Client) {
			if (Date.now() >= startTime + timeoutMs) {
				throw new Error('Lock has expired')
			}

			const value = target[prop]
			return typeof value === 'function' ? value.bind(target) : value
		}
	}

	return new Proxy(client, handler) as Client
}

const pause = (duration: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, duration)
	})
}
