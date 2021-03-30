import fs from 'fs'
import os from 'os'
import path from 'path'

import { Octokit } from '@octokit/rest'

import { PLUGIN_NAME } from '../lib/constant'
import log from '../lib/log'
import request from '../lib/request'

abstract class Downloader {
  abstract getDownloadUrl(): Promise<string>

  private getSavedFileName() {
    const fileName = 'mkcert'
    return process.platform === 'win32' ? `${fileName}.ext` : fileName
  }

  private getSavedPath() {
    return path.join(os.homedir(), PLUGIN_NAME, this.getSavedFileName())
  }

  private async download() {
    const savedPath = this.getSavedPath()
    const downloadUrl = await this.getDownloadUrl()
    log('Downloading the mkcert executable from %s', downloadUrl)
    const { data } = await request.get(downloadUrl)
    fs.mkdirSync(savedPath, { recursive: true })
    fs.writeFileSync(savedPath, data)
    log('The mkcert has been saved to %s', savedPath)
  }
}

class OfficialDownloader extends Downloader {
  async getDownloadUrl() {
    const octokit = new Octokit()

    const res = await octokit.repos.getLatestRelease({
      owner: 'FiloSottile',
      repo: 'mkcert'
    })
    console.log(res.data.assets)
  }
}
