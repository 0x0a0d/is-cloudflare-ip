import { get } from 'https'
import { cidrSubnet, SubnetInfo } from 'ip'

/**
IPv4: https://www.cloudflare.com/ips-v4
IPv6: https://www.cloudflare.com/ips-v6
 */

export const parseList = (res: string): string[] => {
  return res.trim().split(/\s*\r?\n\s*/)
}

const getUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('response statusCode must be 200'))
      res.setEncoding('utf-8')
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        res.destroy()
        resolve(data)
      })
    }).once('error', reject)
  })
}

const parseSubnetInfoList = (res: string): SubnetInfo[] => {
  return parseList(res).map(cidr => cidrSubnet(cidr))
}

export const getV4List = async(): Promise<string> => getUrl('https://www.cloudflare.com/ips-v4')
export const getV6List = async(): Promise<string> => getUrl('https://www.cloudflare.com/ips-v6')

type SubnetInfos = {v4: SubnetInfo[], v6: SubnetInfo[]}
export const getSubnetInfos = async(): Promise<SubnetInfos> => {
  return Promise.all([
    getV4List().then(parseSubnetInfoList),
    getV6List().then(parseSubnetInfoList),
  ]).then(([v4, v6]) => {
    return {
      v4, v6
    }
  })
}
