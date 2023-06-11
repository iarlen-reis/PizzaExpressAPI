import fastify, { FastifyInstance } from 'fastify'
import { MenuRoutes } from './routes/menu'

class Server {
  app: FastifyInstance

  constructor() {
    this.app = fastify()
  }

  routes() {
    new MenuRoutes(this.app)
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
