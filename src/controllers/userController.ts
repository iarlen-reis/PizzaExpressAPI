import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../utils/envShema'

export class UserController {
  app: FastifyInstance

  constructor(app: FastifyInstance) {
    this.app = app
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (findUser) {
      return reply.status(422).send({ error: 'email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { name, email }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user)
      return reply.status(404).send({ error: 'Invalid email or password.' })

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return reply.status(401).send({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email,
        role: user.role,
      },
      env.SECRET,
      {
        expiresIn: '30 days',
      },
    )

    return { token }
  }

  async profile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        orders: {
          include: { dish: true },
        },
      },
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' })
    }

    return user
  }
}
