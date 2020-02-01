import { promises as fs } from 'fs'
import { getBuffer, getDocument } from './cheerioUtil'
import log from 'loglevel'
import compact from 'lodash/compact'
import { paths } from './config'

log.setLevel(0)

interface Package {
  id: number
  name: string
  hasRetailVersion?: boolean
}

// TODO mkdirp around this
const downloadDir = `${process.env.HOME}/.wow-addons/cache`

const packageList: Package[] = [
  { id: 24910, name: 'WeakAuras 2', hasRetailVersion: true },
  // { id: 25178, name: 'AutoBiographer' },
]

const baseUrl = `https://www.wowinterface.com`

const pageUrl = ({ id, hasRetailVersion }: Package) =>
  hasRetailVersion
    ? `${baseUrl}/downloads/info${id}`
    : `${baseUrl}/downloads/landing.php?fileid=${id}`

async function fetchDownloadUrl(pkg: Package) {
  const $ = await getDocument(pageUrl(pkg))

  const downloadLink = pkg.hasRetailVersion
    ? baseUrl + $(`#download > a[title="WoW Classic"]`).attr('href') || ''
    : $('.manuallink > a').attr('href')

  if (downloadLink !== undefined && downloadLink !== baseUrl) {
    log.debug(`Found download link for ${pkg.name}: ${downloadLink}`)
    return downloadLink
  } else {
    log.error(`Unable to find download link for ${pkg.name} at ${pageUrl(pkg)}`)
  }
}

async function writeFile(link: string) {
  const [filename, buffer] = await getBuffer(link)

  await fs.mkdir('/tmp/wow-addons', { recursive: true })
  return fs.writeFile(`/tmp/wow-addons/${filename}`, buffer, {})
}

async function main() {
  const links = await Promise.all(packageList.map(fetchDownloadUrl))
  Promise.all(compact(links).map(writeFile))
}

// main().catch(console.error)
