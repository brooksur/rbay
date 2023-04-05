import { client } from '$services/redis'
import { deserialize } from './deserialize'
import { itemsIndexKey } from '$services/keys'

export const searchItems = async (term: string, size: number = 5) => {
	const searchTerm = term
		.replaceAll(/[^a-zA-Z0-9 ]/g, '')
		.trim()
		.split(/\s+/)
		.map(word => (word ? `%${word}%` : ''))
		.join(' ')

	if (!searchTerm) return []

	const searchResults = await client.ft.search(itemsIndexKey(), searchTerm, {
		LIMIT: { from: 0, size }
	})

	const { total, documents } = searchResults

	return documents.map(({ id, value }) => deserialize(id, value as any))
}
