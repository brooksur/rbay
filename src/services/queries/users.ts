import type { CreateUserAttrs } from '$services/types'
import { genId } from '$services/utils'
import { client } from '$services/redis'
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys'

export const getUserByUsername = async (username: string) => {
	const decimalId = await client.zScore(usernamesKey(), username)

	if (!decimalId) {
		throw new Error('User not found')
	}

	const id = decimalId.toString(16)
	const user = await client.hGetAll(usersKey(id))

	return deserialize(id, user)
}

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id))
	return deserialize(id, user)
}

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId()

	// see if username is in username set
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username)

	if (exists) {
		throw new Error('Username is taken')
	}

	// create user and add username to set
	await Promise.all([
		client.hSet(usersKey(id), serialiize(attrs)),
		client.sAdd(usernamesUniqueKey(), attrs.username),
		client.zAdd(usernamesKey(), {
			value: attrs.username,
			score: parseInt(id, 16)
		})
	])

	return id
}

const serialiize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	}
}

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	}
}
