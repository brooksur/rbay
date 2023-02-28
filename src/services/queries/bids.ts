import type { CreateBidAttrs, Bid } from '$services/types'
import { bidHistoryKey, itemsKey, itemsByPriceKey } from '$services/keys'
import { client } from '$services/redis'
import { DateTime } from 'luxon'
import { getItem } from './items'

export const createBid = async (attrs: CreateBidAttrs) => {
	return client.executeIsolated(async iso => {
		await iso.watch(itemsKey(attrs.itemId))

		const item = await getItem(attrs.itemId)

		if (!item) {
			throw new Error('Unable to place bid because item was not found')
		}

		if (item.price >= attrs.amount) {
			throw new Error('Bid amount must be higher than the items price')
		}

		if (item.endingAt.diff(DateTime.now()).toMillis() <= 0) {
			throw new Error('Item bidding has ended')
		}

		const serialized = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

		return iso
			.multi()
			.rPush(bidHistoryKey(attrs.itemId), serialized)
			.hSet(itemsKey(item.id), {
				bids: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			})
			.zAdd(itemsByPriceKey(), {
				value: item.id,
				score: attrs.amount
			})
			.exec()
	})
}

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count
	const endIndex = -1 - offset
	const history = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex)
	return history.map(deserializeHistory)
}

const serializeHistory = (amount: number, createdAt: number) => `${amount}:${createdAt}`
const deserializeHistory = (serial: string) => {
	const [amount, createdAt] = serial.split(':')
	return { amount: parseFloat(amount), createdAt: DateTime.fromMillis(parseInt(createdAt)) }
}
