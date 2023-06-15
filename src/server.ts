import fastify, { FastifyInstance } from 'fastify'
import { DishesRoutes } from './routes/dishesRoutes'
import { UserRoutes } from './routes/userRoutes'
import { OrderRoutes } from './routes/orderRoutes'
import { UploadRoutes } from './routes/uploadRoutes'
import { GraphicRoutes } from './routes/graphicRoutes'
import { resolve } from 'path'

import multipart from '@fastify/multipart'

class Server {
  app: FastifyInstance

  constructor() {
    this.app = fastify()

    this.app.register(multipart)

    this.app.register(require('@fastify/static'), {
      root: resolve(__dirname, '../', 'uploads'),
      prefix: '/uploads',
    })
  }

  routes() {
    new DishesRoutes(this.app)
    new UserRoutes(this.app)
    new OrderRoutes(this.app)
    new UploadRoutes(this.app)
    new GraphicRoutes(this.app)
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
