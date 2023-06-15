import { FastifyInstance } from 'fastify'
import { GraphicController } from '../controllers/graphicController'
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware'

export class GraphicRoutes {
  app: FastifyInstance
  graphicController: GraphicController
  auth: AuthenticationMiddleware

  constructor(app: FastifyInstance) {
    this.app = app
    this.graphicController = new GraphicController()
    this.auth = new AuthenticationMiddleware()

    this.allOrderRoutes()
  }

  allOrderRoutes() {
    this.app.get(
      '/graphic/:query',
      { preHandler: this.auth.authenticate },
      this.graphicController.index,
    )
  }
}
