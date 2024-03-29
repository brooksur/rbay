import { SchemaFieldTypes } from 'redis'
import { client } from './client'
import { itemsIndexKey, itemsKey } from '$services/keys'

export const createIndexes = async () => {
	const indexes = await client.ft._list()
	indexes.includes(itemsIndexKey()) || itemsSearchIndex()
}

export const itemsSearchIndex = () => {
	client.ft.create(
		itemsIndexKey(),
		{
			name: {
				type: SchemaFieldTypes.TEXT
			},
			description: {
				type: SchemaFieldTypes.TEXT
			}
		},
		{
			ON: 'HASH',
			PREFIX: itemsKey('')
		}
	)
}
