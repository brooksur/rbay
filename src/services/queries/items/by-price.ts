import { client } from '$services/redis'
import { itemsKey, itemsByPriceKey } from '$services/keys'
import { deserialize } from './deserialize'

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const zip = (prop: string) => `${itemsKey('*')}->${prop}`

	let results: any = await client.sort(itemsByPriceKey(), {
		GET: ['#', zip('name'), zip('views'), zip('endingAt'), zip('imageUrl'), zip('price')],
		BY: 'score',
		DIRECTION: order,
		LIMIT: {
			offset,
			count
		}
	})

	const items = []

	while (results.length) {
		const [id, name, views, endingAt, imageUrl, price, ...rest] = results
		items.push(deserialize(id, { name, views, endingAt, imageUrl, price }))
		results = rest
	}

	return items
}
