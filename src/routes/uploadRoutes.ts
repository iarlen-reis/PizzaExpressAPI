import { FastifyInstance } from 'fastify'
import { UploadController } from '../controllers/uploadController'
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware'

export class UploadRoutes {
  app: FastifyInstance
  uploadController: UploadController
  auth: AuthenticationMiddleware

  constructor(app: FastifyInstance) {
    this.app = app
    this.uploadController = new UploadController()
    this.auth = new AuthenticationMiddleware()

    this.allUserRoutes()
  }

  allUserRoutes() {
    this.app.get('/dishes/upload', this.uploadController.index)
    this.app.post(
      '/dishes/upload',
      { preHandler: this.auth.authenticate },
      this.uploadController.create,
    )
    this.app.delete(
      '/dishes/upload/:id',
      { preHandler: this.auth.authenticate },
      this.uploadController.delete,
    )
  }
}
