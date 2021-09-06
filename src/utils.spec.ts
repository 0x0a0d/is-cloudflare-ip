import { getV4List, getV6List } from './utils'
import { cidrSubnet } from 'ip'

describe('Test get list', () => {
  it('should return list of v4', async() => {
    const res = await getV4List()
    expect(typeof res).toBe('string')
    expect(res.trim().split(/\s*\n\s*/).every(cidr => {
      try {
        cidrSubnet(cidr)
        return true
      } catch (e) {
        return false
      }
    })).toBe(true)
  })
  it('should return list of v6', async() => {
    const res = await getV6List()
    expect(typeof res).toBe('string')
    expect(res.trim().split(/\s*\n\s*/).every(cidr => {
      try {
        cidrSubnet(cidr)
        return true
      } catch (e) {
        return false
      }
    })).toBe(true)
  })
})
