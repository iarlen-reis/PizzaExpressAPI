import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/userController'

export class UserRoutes {
  app: FastifyInstance
  userController: UserController

  constructor(app: FastifyInstance) {
    this.app = app
    this.userController = new UserController(this.app)

    this.allUserRoutes()
  }

  allUserRoutes() {
    this.app.post('/auth/register', this.userController.register)
    this.app.post('/auth/login', this.userController.login)
  }
}
