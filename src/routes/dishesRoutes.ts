import { FastifyInstance } from 'fastify'
import { DishesController } from '../controllers/dishesController'

export class DishesRoutes {
  app: FastifyInstance
  dishesController: DishesController

  constructor(app: FastifyInstance) {
    this.app = app
    this.dishesController = new DishesController()

    this.allDishesRoutes()
  }

  allDishesRoutes() {
    this.app.get('/dishes', this.dishesController.index)
    this.app.post('/dishes', this.dishesController.store)
    this.app.get('/dishes/:id', this.dishesController.show)
    this.app.put('/dishes/:id', this.dishesController.update)
    this.app.delete('/dishes/:id', this.dishesController.delete)
  }
}
