import ghRelease from 'gh-release'
import {
  lastTag,
  getPreviousTag,
  getCurrentBranch,
  getGithubToken,
  pushGit
} from './git'
import { createChangelog } from './changelog'

const ReleaseTitle = 'vite-plugin-mkcert'

const isPrerelease = (tag: string) => {
  return /(?:beta|rc|alpha)/.test(tag)
}

const createReleaseNote = () => {
  const to = lastTag()
  const from = getPreviousTag(to)
  const body = createChangelog(from, to)
  const branch = getCurrentBranch()
  const token = getGithubToken()
  return new Promise((resolve, reject) => {
    ghRelease(
      {
        cli: true,
        tag_name: to,
        target_commitish: branch,
        name: `${ReleaseTitle} - ${to}`,
        body,
        draft: false,
        prerelease: isPrerelease(to),
        owner: 'liuweiGL',
        repo: 'vite-plugin-mkcert',
        endpoint: 'https://api.github.com',
        auth: {
          token
        }
      },
      (err: unknown, response: unknown) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      }
    )
  })
}

const releaseGithub = async () => {
  pushGit()
  await createReleaseNote()

  console.log('🎉：Release Note upload success!')
}

releaseGithub()
