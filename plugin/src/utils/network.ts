import os from 'node:os'

/**
 * http://nodejs.cn/api/os/os_networkinterfaces.html
 */
const isIPV4 = (family: string | number) => {
  return family === 'IPv4' || family === 4
}

const isIPV6 = (family: string | number) => {
  return family === 'IPv6' || family === 6
}

const getLocalIps = (matcher: (family: string | number) => boolean) => {
  const interfaceDict = os.networkInterfaces()
  const addresses = new Set<string>()

  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key]
    if (interfaces) {
      for (const item of interfaces) {
        if (matcher(item.family)) {
          addresses.add(item.address)
        }
      }
    }
  }

  return Array.from(addresses)
}

export const getLocalV4Ips = () => {
  return getLocalIps(isIPV4)
}

export const getLocalV6Ips = () => {
  return getLocalIps(isIPV6)
    .map(ip => {
      // Strip scope id (e.g. %en0) to avoid invalid SAN entries.
      return ip.split('%')[0]
    })
    .filter(Boolean)
}

export const getDefaultHosts = () => {
  return ['localhost', '::1', ...getLocalV4Ips(), ...getLocalV6Ips()]
}
