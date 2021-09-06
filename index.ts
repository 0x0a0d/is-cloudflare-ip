import { cidrSubnet, isV4Format, isV6Format, SubnetInfo } from 'ip'
import { v4, v6 } from './src/ip-cached'
import { getSubnetInfos } from './src/utils'

type TCloudflareIPs = {
  v4?: string[]
  v6?: string[]
}
export class CloudflareIP {
  _timeout: any
  _interval: number
  v4: SubnetInfo[]
  v6: SubnetInfo[]

  constructor(options?: TCloudflareIPs) {
    this.v4 = (options?.v4 ?? v4).map(cidr => cidrSubnet(cidr))
    this.v6 = (options?.v6 ?? v6).map(cidr => cidrSubnet(cidr))
  }

  validate(ip: string) {
    return isV4Format(ip)
      ? this.v4.some(subnetInfo => subnetInfo.contains(ip))
      : isV6Format(ip)
        ? this.v6.some(subnetInfo => subnetInfo.contains(ip))
        : false
  }

  validateV4(ipV4: string) {
    return isV4Format(ipV4) && this.v4.some(subnetInfo => subnetInfo.contains(ipV4))
  }

  validateV6(ipV6: string) {
    return isV6Format(ipV6) && this.v6.some(subnetInfo => subnetInfo.contains(ipV6))
  }

  async update(interval?: number, onError?: (_error: any) => void) {
    clearTimeout(this._timeout)
    if (interval == null || interval <= 0) {
      this._interval = null
    } else {
      if (interval < 1000) console.warn(`CloudflareIP.update: interval is in milliseconds. You entered '${interval}' is less than 1000ms`)
      this._interval = interval
    }
    return this._update().catch(e => {
      onError && onError(e)
    })
  }

  async _update() {
    const { v4, v6 } = await getSubnetInfos()
    this.v4 = v4
    this.v6 = v6

    if (this._interval) {
      this._timeout = setTimeout(() => this._update(), this._interval)
    }
  }

  destroyInterval() {
    this._interval = null
    clearTimeout(this._timeout)
  }
}
