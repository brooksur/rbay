import { client } from '$services/redis'
import { itemsKey, itemsByViewKey, itemsViewsKey } from '$services/keys'

export const incrementView = async (itemId: string, userId: string) => {
	const inserted = await client.pfAdd(itemsViewsKey(itemId), userId)

	if (inserted)
		await Promise.all([
			client.hIncrBy(itemsKey(itemId), 'views', 1),
			client.zIncrBy(itemsByViewKey(), 1, itemId)
		])
}
