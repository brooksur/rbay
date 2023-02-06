import type { CreateUserAttrs } from '$services/types'
import { genId } from '$services/utils'
import { client } from '$services/redis'
import { usersKey } from '$services/keys'

export const getUserByUsername = async (username: string) => {}

export const getUserById = async (id: string) => {}

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId()
	client.hSet(usersKey(id), serialiize(attrs))
	return id
}

const serialiize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	}
}
