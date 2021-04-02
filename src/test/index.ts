// import { Octokit } from '@octokit/rest'

import { CodingSource } from '../mkcert/Source'

// const octokit = new Octokit()

// const run = async () => {
//   const res = await octokit.repos.getLatestRelease({
//     owner: 'FiloSottile',
//     repo: 'mkcert'
//   })
//   console.log(res.data.assets)
// }
;

(async () => {
  await CodingSource.create().getSourceInfo()
})()
