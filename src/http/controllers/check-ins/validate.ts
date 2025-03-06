import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'

export async function validate(req: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })


  const { checkInId } = validateCheckInParamsSchema.parse(req.params)

  const validateCheckInService = makeValidateCheckInService()

  await validateCheckInService.execute({
    checkInId,
  })

  return reply
    .status(204)
    .send()
}
