import { client } from '$services/redis'
import { itemsKey, itemsByViewKey } from '$services/keys'

export const incrementView = async (itemId: string, userId: string) => {
	await Promise.all([
		client.hIncrBy(itemsKey(itemId), 'views', 1),
		client.zIncrBy(itemsByViewKey(), 1, itemId)
	])
}
