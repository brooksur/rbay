export const withLock = async (key: string, cb: () => any) => {
	// init some vars
	const delayms = 100
	const maxTries = 20
}

const buildClientProxy = () => {}

const pause = (duration: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, duration)
	})
}
