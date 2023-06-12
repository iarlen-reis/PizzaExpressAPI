import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export class OrderController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role === 1) {
      return await prisma.order.findMany({
        include: { dish: true },
      })
    }

    return prisma.order.findMany({
      where: {
        userId: request.user.id,
      },
      include: { dish: true },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      dishId: z.string(),
    })

    const { dishId } = bodySchema.parse(request.body)

    const dish = await prisma.dish.findUnique({
      where: {
        id: dishId,
      },
    })

    if (!dish) return reply.status(404).send({ error: 'dish not found.' })

    const order = await prisma.order.create({
      data: {
        dishId: dish.id,
        userId: request.user.id,
        createdBy: request.user.name,
      },
      include: { dish: true },
    })

    return order
  }
}
