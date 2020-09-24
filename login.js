const express = require('express')
const router = express.Router()

module.exports = () => {
	const router = new SignUpRouter()
	router.post('/signup', ExpressRouterAdapter.adapt(router))
}

// Creating an apapter (Adapter Pattern, that maps our response)
class ExpressRouterAdapter {
	static adapt (router) {
		return async (req, res) => {
			const httpRequest = {
				body: req.body
			}

			const httpResponse = await router.route(httpRequest)
			res.status(httpResponse.statusCode).json(httpResponse.body)
		}
	}
}

//Presentation layer
//signup-router
class SignUpRouter {
	async route (httpRequest) {
		const { email, password, repeatPassword } = httpRequest.body
		const user = new SignUpUseCase().signUp(email, password, repeatPassword) 
		//here, the usecase is instantiated inside the router, so we're creating an instance  
		//of the dependecy inside the component. To solve this, we're gonna inject the dependencies
		//through the constructor using the Dependency Injection Pattern. In the end, the idea is making 
		// the SignUpRouter, the SignUpUseCase and AddAccountRepository reusable components and an fourth layer 
		//will appear, using the Composer Design Pattern
		return {
			statusCode: 200,
			body: user
		}
	}
}

//Domain layer
//signup-usecase (usecase - used on clean architecture), wich will have all the programming business rules
class SignUpUseCase {
	async signup (email, password, repeatPassword) {
		if (password === repeatPassword) {
			new AddAccountRepository().add(email, password)
		}
	}
}

//Infra layer, where we choose our framework, ORM we're going to use to connect to the DB
//add-account-repository, wich will basically touch the database (Repository Patterns)
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
	async add (email, password, repeatPassword) {
		const user =  await AccountModel.create({ email, password })
		return user 
	}
}

//The increase of number of lines can lead us to think that we're overengineering our project. However, it's respecting 
//one of the principles of clean architecture that is respect SOLID. The first character of this mnemonic "S" 
//stands for "Single Responsibility Principle", what basically means broke our code delegating small responsibilities to this pieces
