export const pageCacheKey = (id: string) => `pagecache#${id}`
export const usersKey = (id: string) => `users#${id}`
export const sessionsKey = (id: string) => `sessions#${id}`
export const usernamesUniqueKey = () => 'usernames:unique'
export const userLikesKey = (userId: string) => `user:likes#${userId}`
export const usernamesKey = () => 'usernames'

// Items
export const itemsKey = (id: string) => `items#${id}`
export const itemsByViewKey = () => 'items:views'
export const itemsByEndingAtKey = () => 'items:endingAt'
export const itemsViewsKey = (id: string) => `items:views#${id}`
