//we can use spec.js or test.js. Jest can recognize both.
const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')

//introduce the Factory Design Pattern. Basically avoid us to broke
//all the snippets who call that instance of the class when changing
//this instance
const makeSut = () => {
	class AuthUseCaseSpy {
		auth (email, password) {
			this.email = email
			this.password = password
		}
	}
	//Making a Dependece Injection
	const authUseCaseSpy = new AuthUseCaseSpy()
	const sut = new LoginRouter(authUseCaseSpy)
	return {
		sut, 
		authUseCaseSpy	
	}
}

describe('Login Router', () => {
	test('Should return 400 if no email is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				password: 'any_password'
			}
		}
		const httpResponse = sut.route(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})

	test('Should return 400 if no password is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@email.com'
			}
		}
		const httpResponse = sut.route(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})

	test('Should return 500 if no httpRequest is provided', () => {
		const { sut } = makeSut()
		const httpResponse = sut.route()
		expect(httpResponse.statusCode).toBe(500)	
			
	})

	test('Should return 500 if httpRequest has no body', () => {
		const { sut } = makeSut()
		const httpRequest = {}
		const httpResponse = sut.route(httpRequest)
		expect(httpResponse.statusCode).toBe(500)	
			
	})

	test('Should call AuthUseCase with correct params', () => {
		const { sut, authUseCaseSpy } = makeSut()
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
				password: "any_password"
			}
		}
		sut.route(httpRequest)
		expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
		expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
	})
})