import type { CreateItemAttrs } from '$services/types'

export const serialize = (attrs: CreateItemAttrs) => {
	return {
		...attrs,
		createdAt: attrs.createdAt.toMillis(),
		updatedAt: attrs.endingAt.toMillis(),
    endingAt
	}
}
