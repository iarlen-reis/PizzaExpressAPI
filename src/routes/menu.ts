import { FastifyInstance } from 'fastify'
import { MenuController } from '../controllers/menuController'

export class MenuRoutes {
  app: FastifyInstance
  menuController: MenuController

  constructor(app: FastifyInstance) {
    this.app = app
    this.menuController = new MenuController()

    this.allMenuRoutes()
  }

  allMenuRoutes() {
    this.app.get('/dishes', this.menuController.index)
    this.app.post('/dishes', this.menuController.store)
    this.app.get('/dishes/:id', this.menuController.show)
  }
}
