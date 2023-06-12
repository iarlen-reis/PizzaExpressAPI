import fastify, { FastifyInstance } from 'fastify'
import { DishesRoutes } from './routes/dishesRoutes'
import { UserRoutes } from './routes/userRoutes'
import { OrderRoutes } from './routes/orderRoutes'

class Server {
  app: FastifyInstance

  constructor() {
    this.app = fastify()
  }

  routes() {
    new DishesRoutes(this.app)
    new UserRoutes(this.app)
    new OrderRoutes(this.app)
  }

  start() {
    this.routes()

    this.app
      .listen({
        port: 3333,
        host: '0.0.0.0',
      })
      .then((response) => console.log('Server started on port 3333.'))
  }
}

const server = new Server()

server.start()
