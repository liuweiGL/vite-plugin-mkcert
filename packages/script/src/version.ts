import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'
import { resolveRoot } from './util'
import config from './config.json'

const { version: currentVersion } = config

type Options = {
  releaseType: semver.ReleaseType
  preid?: string
}

const getNewVersion = ({ releaseType, preid }: Options) => {
  return semver.inc(currentVersion, releaseType, preid)
}

const updatePackage = async (version: string) => {
  const packagesPath = resolveRoot('packages')
  const packages = fs.opendirSync(packagesPath)

  for await (const item of packages) {
    if (item.isDirectory()) {
      const pkgPath = path.resolve(packagesPath, item.name, 'package.json')
      const pkgObj = fs.readJSONSync(pkgPath)

      fs.writeJsonSync(
        pkgPath,
        {
          ...pkgObj,
          version
        },
        {
          spaces: 2
        }
      )
    }
  }
}

const updateConfig = (version: string) => {
  const configPath = path.resolve(__dirname, 'config.json')
  const configObj = fs.readJSONSync(configPath)

  fs.writeJsonSync(
    configPath,
    {
      ...configObj,
      version
    },
    {
      spaces: 2
    }
  )
}


;(() => {
  const [, , releaseType = 'minor', preid = 'alpha'] = process.argv

  const version = getNewVersion({
    releaseType: releaseType as semver.ReleaseType,
    preid
  })

  updatePackage(version)
  updateConfig(version)
})()
