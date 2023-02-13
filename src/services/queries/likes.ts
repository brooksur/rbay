import { client } from '$services/redis'
import { userLikesKey, itemsKey } from '$services/keys'
import { getItems } from '$services/queries/items'

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId)
}

export const likedItems = async (userId: string) => {
	const ids = await client.sMembers(userLikesKey(userId))
	return getItems(ids)
}

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userLikesKey(userId), itemId)

	if (inserted) {
		await client.hIncrBy(itemsKey(itemId), 'likes', 1)
	}
}

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userLikesKey(userId), itemId)

	if (removed) {
		await client.hIncrBy(itemsKey(itemId), 'likes', -1)
	}
}

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)])
	return getItems(ids)
}
