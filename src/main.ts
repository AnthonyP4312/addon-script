import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs';

interface Package {
  id: number,
  name: string,
  downloadName: string
}

const packageList: Package[] = [
  {id: 25202, name: 'InFlightClassic', downloadName: "InFlight"}
]

const downloadUrl = ({id, downloadName}: Package, version: string) =>
  `https://cdn.wowinterface.com/downloads/file${id}/${downloadName}}-${version}.zip`

const pageUrl = ({id, name}: Package) =>
  `https://www.wowinterface.com/downloads/info${id}-${name}.html`

const extractVersion = (ver: string) => {
  if (ver.includes("Classic: ")) {
    const [, version] = ver.split("Classic: ")
    return version
  } else {
    return ver.replace("Version: ", "")
  }
}

async function main() {
  for (const pkg of packageList) {
    const $ = await axios.get(pageUrl(pkg))
      .then(({data}) => cheerio.load(data))

    const version = extractVersion($('#version').text())
    console.log(version)

    const res = await axios.get(downloadUrl(pkg, version), {
      responseType: 'arraybuffer',
      timeout: 30000
    })

    fs.writeFileSync(`/tmp/${pkg.name}-${version}.zip`, res.data)
  }
}

main();
