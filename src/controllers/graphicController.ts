import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ordersReducer } from '../utils/ordersReducer'
import { FastifyReply, FastifyRequest } from 'fastify'

export class GraphicController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role !== 1) {
      return reply.status(401).send({ error: 'unauthorized user.' })
    }

    const queryShema = z.object({
      q: z.string(),
    })

    const { q } = queryShema.parse(request.query)

    const data = await prisma.order.findMany({
      where: {
        status: q,
      },
      include: { dish: true },
    })

    const { labels, values, backgrounds } = ordersReducer(data)

    const graphicData = { labels, values, backgrounds }

    return graphicData
  }
}
