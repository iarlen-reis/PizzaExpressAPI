import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ordersReducer } from '../utils/ordersReducer'
import { FastifyReply, FastifyRequest } from 'fastify'

export class GraphicController {
  async index(request: FastifyRequest, reply: FastifyReply) {
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
