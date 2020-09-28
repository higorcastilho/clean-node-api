module.exports = class InternalServerError extends Error {
	constructor() {
		super('Internal Server error')
		this.name = 'InternalServerError'
	}
}