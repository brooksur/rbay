import { client } from '$services/redis'

export const incrementView = (itemId: string, userId: string) => {
	return client.incrementView(itemId, userId)
}
