// import { Octokit } from '@octokit/rest'

// const octokit = new Octokit()

// const run = async () => {
//   const res = await octokit.repos.getLatestRelease({
//     owner: 'FiloSottile',
//     repo: 'mkcert'
//   })
//   console.log(res.data.assets)
// }
import { GithubDownloader } from '../mkcert/downloader'
// eslint-disable-next-line prettier/prettier
;

;(async () => {
  const data = await GithubDownloader.create().getAssetInfo()
  console.log(data)
})()
