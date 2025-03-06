import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service'

export async function search(req: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsQuerySchema.parse(req.query)

  const searchGyms = makeSearchGymsService()

  const { gyms } = await searchGyms.execute({
    query,
    page
  })

  return reply
    .status(200)
    .send({
      gyms,
    })
}
