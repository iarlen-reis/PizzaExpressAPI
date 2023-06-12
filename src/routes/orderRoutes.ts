import { FastifyInstance } from 'fastify'
import { OrderController } from '../controllers/orderController'
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware'

export class OrderRoutes {
  app: FastifyInstance
  orderController: OrderController
  auth: AuthenticationMiddleware

  constructor(app: FastifyInstance) {
    this.app = app
    this.orderController = new OrderController()
    this.auth = new AuthenticationMiddleware()

    this.allOrderRoutes()
  }

  allOrderRoutes() {
    this.app.get(
      '/orders',
      { preHandler: this.auth.authenticate },
      this.orderController.index,
    )
    this.app.post(
      '/orders',
      { preHandler: this.auth.authenticate },
      this.orderController.create,
    )
  }
}
