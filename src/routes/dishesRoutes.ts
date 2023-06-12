import { FastifyInstance } from 'fastify'
import { DishesController } from '../controllers/dishesController'

import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware'

export class DishesRoutes {
  app: FastifyInstance
  dishesController: DishesController
  auth: AuthenticationMiddleware

  constructor(app: FastifyInstance) {
    this.app = app
    this.dishesController = new DishesController()
    this.auth = new AuthenticationMiddleware()

    this.allDishesRoutes()
  }

  allDishesRoutes() {
    this.app.get('/dishes', this.dishesController.index)
    this.app.get('/dishes/:id', this.dishesController.show)

    this.app.post(
      '/dishes',
      { preHandler: this.auth.authenticate },
      this.dishesController.store,
    )
    this.app.put(
      '/dishes/:id',
      { preHandler: this.auth.authenticate },
      this.dishesController.update,
    )
    this.app.delete(
      '/dishes/:id',
      { preHandler: this.auth.authenticate },
      this.dishesController.delete,
    )
  }
}
