import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export class MenuController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dishes = await prisma.dish.findMany()

      reply.status(200).send(dishes)
    } catch (error) {
      reply
        .send(500)
        .send({ error: 'An error occurred, please try again later.' })
    }
  }

  async store(request: FastifyRequest, reply: FastifyReply) {
    try {
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
    } catch (error) {
      reply
        .status(500)
        .send({ error: 'An error occurred, please try again later.' })
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      })

      const { id } = paramsSchema.parse(request.params)

      const dish = await prisma.dish.findUniqueOrThrow({
        where: {
          id,
        },
      })

      return dish
    } catch (error) {
      reply.status(404).send({ error: 'Dish not found.' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      })

      const { id } = paramsSchema.parse(request.params)

      const dish = await prisma.dish.findFirstOrThrow({
        where: {
          id,
        },
      })

      await prisma.dish.delete({
        where: {
          id: dish.id,
        },
      })

      return dish
    } catch (error) {
      reply.status(404).send({ error: 'Dish not found.' })
    }
  }
}
