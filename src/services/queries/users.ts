import type { CreateUserAttrs } from '$services/types'
import { genId } from '$services/utils'
import { client } from '$services/redis'
import { usersKey, usernamesUniqueKey } from '$services/keys'

export const getUserByUsername = async (username: string) => {}

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id))
	return deserialize(id, user)
}

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId()

	// see if username is in username set
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username)

	console.log('hello', exists)

	if (exists) {
		throw new Error('Username is taken')
	}

	// create user and add username to set
	await Promise.all([
		client.hSet(usersKey(id), serialiize(attrs)),
		client.sAdd(usernamesUniqueKey(), attrs.username)
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
