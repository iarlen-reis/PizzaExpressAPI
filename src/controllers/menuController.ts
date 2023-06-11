import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export class MenuController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    const dishes = await prisma.dish.findMany()

    reply.status(200).send(dishes)
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
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
  }
}
