import { CloudflareIP } from './index'

describe('Test class CloudflareIP', () => {
  describe('update list', () => {
    it('non empty list', async() => {
      const cloudflareIP = new CloudflareIP({
        v4: [],
        v6: []
      })
      await cloudflareIP.update()
      expect(cloudflareIP.v4.length > 0).toBe(true)
      expect(cloudflareIP.v6.length > 0).toBe(true)
      expect(cloudflareIP._interval == null).toBe(true)
      expect(cloudflareIP._timeout == null).toBe(true)
    })
    it('interval & destroy', async() => {
      const cloudflareIP = new CloudflareIP({
        v4: [],
        v6: []
      })
      const timeout = 3000

      await cloudflareIP.update(timeout)
      expect(cloudflareIP.v4.length > 0).toBe(true)
      expect(cloudflareIP.v6.length > 0).toBe(true)
      expect(cloudflareIP._interval === timeout).toBe(true)
      expect(cloudflareIP._timeout != null).toBe(true)

      cloudflareIP.destroyInterval()
      expect(cloudflareIP._interval == null).toBe(true)
      expect(cloudflareIP._timeout == null || cloudflareIP._timeout._destroyed).toBe(true)
    })
  })
  describe('validate', () => {
    const cloudflareIP = new CloudflareIP()
    it('v4/6', () => {
      expect(cloudflareIP.validate('103.21.244.0')).toBe(true)
      expect(cloudflareIP.validate('2400:cb00:0000::0000')).toBe(true)
      expect(cloudflareIP.validate('noop')).toBe(false)
      expect(cloudflareIP.validate('127.0.0.1')).toBe(false)
      expect(cloudflareIP.validate('172.16.0.12')).toBe(false)
      expect(cloudflareIP.validate('10.0.4.5')).toBe(false)
    })
    it('v4', () => {
      expect(cloudflareIP.validateV4('103.21.244.0')).toBe(true)
      expect(cloudflareIP.validateV4('2400:cb00:0000::0000')).toBe(false)
      expect(cloudflareIP.validateV4('noop')).toBe(false)
    })
    it('v6', () => {
      expect(cloudflareIP.validateV6('103.21.244.0')).toBe(false)
      expect(cloudflareIP.validateV6('2400:cb00:0000::0000')).toBe(true)
      expect(cloudflareIP.validateV6('noop')).toBe(false)
    })
  })
})
