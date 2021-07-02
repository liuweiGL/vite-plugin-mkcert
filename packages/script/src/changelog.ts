import fs from 'fs-extra'
import moment from 'moment'
import { compareTwoStrings } from 'string-similarity'
import {
  listCommits,
  lastTag,
  getSortableAllTags,
  getTaggedTime,
  tagGit
} from './git'
import { resolveRoot } from './util'
import config from './config.json'

const { repo: githubRepo } = config

const CommitGroupBy: Array<[string, string[]]> = [
  [':tada: Enhancements', ['feat', 'features', 'feature']],
  [':beetle: Bug Fixes', ['bug', 'bugfix', 'fix']],
  [':boom: Breaking Changes', ['breaking', 'break']],
  [':memo: Documents Changes', ['doc', 'docs']],
  [':rose: Improve code quality', ['refactor', 'redesign']],
  [':rocket: Improve Performance', ['perf']],
  [':hammer_and_wrench: Update Workflow Scripts', ['build']],
  [':construction: Add/Update Test Cases', ['test']],
  [':blush: Other Changes', ['chore']]
]

const getLatestVersion = () => {
  return fs.readJsonSync('./config.json').version
}

const isPublishMessage = (str: string) => {
  if (/chore\(\s*(?:versions?|publish)\s*\)/.test(str)) return true
  return /publish v?(?:\d+)\.(?:\d+)\.(?:\d+)/.test(str)
}

const getCurrentChanges = (from = lastTag(), to = 'HEAD') => {
  const summarys = []
  return listCommits(from, to).filter(({ summary }) => {
    if (summarys.some(target => compareTwoStrings(target, summary) > 0.5))
      return false
    if (isPublishMessage(summary)) return false
    summarys.push(summary)
    return true
  })
}

const getGroupChanges = (from = lastTag(), to = 'HEAD') => {
  const changes = getCurrentChanges(from, to)
  const results: Array<[string, string[]]> = CommitGroupBy.map(([group]) => [
    group,
    []
  ])
  changes.forEach(({ summary, author, sha }) => {
    for (const [group, value] of CommitGroupBy) {
      if (value.some(target => summary.indexOf(target) === 0)) {
        results.forEach(item => {
          if (item[0] === group) {
            item[1].push(
              `[${summary}](${githubRepo}/commit/${sha}) :point_right: ( [${author}](https://github.com/${author}) )`
            )
          }
        })
      }
    }
  })
  return results.filter(([, value]) => {
    return value.length > 0
  })
}

export const createChangelog = (from = lastTag(), to = 'HEAD') => {
  const isHead = to === 'HEAD'
  const headVersion = isHead ? getLatestVersion() : to
  const changes = getGroupChanges(from, to)
  const nowDate = isHead
    ? moment().format('YYYY-MM-DD')
    : moment(getTaggedTime(to), 'YYYY-MM-DD').format('YYYY-MM-DD')
  const log = changes
    .map(([group, contents]) => {
      return `
### ${group}
${contents
  .map(content => {
    return `
1. ${content}    
`
  })
  .join('')}  
`
    })
    .join('')
  return `
## ${headVersion}(${nowDate})

${log ? log : '### No Change Log'}
`
}

const generateChangeLogFile = () => {
  const tags = getSortableAllTags()
  const file = `
# Changelog
${tags
  .slice(0, 40)
  .map((newer, index) => {
    const older = tags[index + 1]
    if (older) {
      return createChangelog(older, newer)
    }
    return ''
  })
  .join('')}  
`
  fs.writeFileSync(resolveRoot('CHANGELOG.md'), file, 'utf8')
}

export const updateChangeLog = () => {
  const tagVersion = `v${getLatestVersion()}`

  generateChangeLogFile()
  console.log('🎉：Changelog generate success!')

  tagGit(tagVersion)
  console.log(`🎉：Git create tag ${tagVersion} success!`)
}
