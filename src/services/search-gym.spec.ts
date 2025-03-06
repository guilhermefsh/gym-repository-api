import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymService } from './search-gym';

let gymsRepository: inMemoryGymsRepository
let searchGymService: SearchGymService
describe('FetchcheckinHistory Service', () => {

  beforeEach(async () => {
    gymsRepository = new inMemoryGymsRepository
    searchGymService = new SearchGymService(gymsRepository)

  })


  it('should be able to fetch search for gyms', async () => {

    await gymsRepository.create({
      title: 'javascrypt gym',
      description: 'des',
      phone: '11929292929',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })
    await gymsRepository.create({
      title: 'typescriptcrypt gym',
      description: 'des',
      phone: '11929292929',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    const { gyms } = await searchGymService.execute({
      query: 'javascrypt gym',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'javascrypt gym' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {

    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `javascrypt gym ${i}`,
        description: 'des',
        phone: '11929292929',
        latitude: -27.0747279,
        longitude: -49.4889672,
      })
    }

    const { gyms } = await searchGymService.execute({
      query: 'javascrypt',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: `javascrypt gym 21` }),
      expect.objectContaining({ title: `javascrypt gym 22` })
    ])
  })

})
