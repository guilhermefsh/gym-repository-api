import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryGymsQuerySchema.parse(req.query)

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    userId: req.user.sub,
    page
  })

  return reply
    .status(200)
    .send({
      checkIns,
    })
}
