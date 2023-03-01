import { itemsByViewKey, itemsKey, itemsViewsKey } from '$services/keys'
import { createClient, defineScript } from 'redis'

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
			  local storeAtKey = KEYS[1]
				local addOneTo = ARGV[1]

				return redis.call(
					'SET',
					storeAtKey,
					1 + tonumber(addOneTo)
				)
			`,
			transformArguments(key: string, num: number) {
				return [key, num.toString()]
			},
			transformReply(reply: any) {
				return reply
			}
		}),
		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
			  local itemsViewsKey = KEYS[1]
				local itemsKey = KEYS[2]
				local itemsByViewKey = KEYS[3]
				local itemId = ARGV[1]
				local userId = ARGV[2]
				local inserted = redis.call('PFADD', itemsViewsKey, userId)

				if inserted == 1 then
				  redis.call('HINCRBY', itemsKey, 'views', 1)
					redis.call('ZINCRBY', itemsByViewKey, 1, itemId)
				end
			`,
			transformArguments(itemId: string, userId: string) {
				return [itemsViewsKey(itemId), itemsKey(itemId), itemsByViewKey(), itemId, userId]
			}
		}),
		unlock: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
			  local lockKey = KEYS[1]
				local lockValue = ARGV[1]

				if redis.call('GET', lockKey) == lockValue then
					return redis.call('DEL', lockKey)
				end
			`,
			transformArguments(key: string, value: string) {
				return [key, value]
			}
		})
	}
})

client.on('error', err => console.error(err))
client.connect()

export { client }
