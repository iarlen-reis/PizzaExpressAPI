import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export class MenuRoutes {
  app: FastifyInstance

  constructor(app: FastifyInstance) {
    this.app = app
  }

  private index() {
    this.app.get('/menu', async (request, reply) => {
      reply.status(200).send({ menu: 'aqui' })
    })
  }

  private create() {
    this.app.post('/menu', async (request, reply) => {
      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
        price: z.string(),
        ingredients: z.array(z.string()),
      })

      const { title, description, price, ingredients } = bodySchema.parse(
        request.body,
      )

      const dish = await prisma.dish.create({
        data: {
          title,
          description,
          price,
          ingredients,
        },
      })

      reply.status(201).send(dish)
    })
  }

  allMenuRoutes() {
    this.index()
    this.create()
  }
}
