import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export class OrderController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role === 1) {
      return await prisma.order.findMany({
        include: { dish: { include: { upload: true } } },
      })
    }

    return prisma.order.findMany({
      where: {
        userId: request.user.id,
      },
      include: { dish: { include: { upload: true } } },
    })
  }

  async indexQuery(request: FastifyRequest, reply: FastifyReply) {
    const queryShema = z.object({
      q: z.string(),
    })
    const { q } = queryShema.parse(request.query)

    console.log(q)

    if (request.user.role === 1) {
      return await prisma.order.findMany({
        include: { dish: { include: { upload: true } } },
        where: {
          status: q,
        },
      })
    }

    return prisma.order.findMany({
      where: {
        userId: request.user.id,
        status: q,
      },
      include: { dish: { include: { upload: true } } },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const dish = await prisma.dish.findUnique({
      where: {
        id,
      },
    })

    if (!dish) return reply.status(404).send({ error: 'dish not found.' })

    const order = await prisma.order.create({
      data: {
        dishId: dish.id,
        userId: request.user.id,
        createdBy: request.user.name,
      },
      include: { dish: { include: { upload: true } } },
    })

    return order
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id,
      },
      include: { dish: { include: { upload: true } } },
    })

    if (order.userId !== request.user.id && request.user.role !== 1) {
      return reply.status(401).send({ error: 'operation not allowed.' })
    }

    return order
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (order.userId !== request.user.id && request.user.role !== 1) {
      return reply.status(401).send({ error: 'operation not allowed.' })
    }

    await prisma.order.delete({
      where: {
        id: order.id,
      },
    })
  }
}
