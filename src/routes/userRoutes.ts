import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/userController'
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware'

export class UserRoutes {
  app: FastifyInstance
  userController: UserController
  auth: AuthenticationMiddleware

  constructor(app: FastifyInstance) {
    this.app = app
    this.userController = new UserController(this.app)
    this.auth = new AuthenticationMiddleware()

    this.allUserRoutes()
  }

  allUserRoutes() {
    this.app.post('/auth/register', this.userController.register)
    this.app.post('/auth/login', this.userController.login)
    this.app.get(
      '/auth/profile',
      { preHandler: this.auth.authenticate },
      this.userController.profile,
    )
  }
}
