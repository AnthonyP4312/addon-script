import envPaths from 'env-paths'
import yaml from 'js-yaml'
import * as fs from 'fs'
import log from 'loglevel'
import { join } from 'path'

export const APP_NAME = 'wow-addon-cli'
export const paths = envPaths(APP_NAME)

// Scaffolds out all directories which are expected to be present
// when reading/writing files
for (const path of Object.values(paths)) {
  log.debug(`Creating directory ${path}`)
  fs.mkdirSync(path, { recursive: true })
}

export const config = readConfig()
console.log(config)

function readConfig() {
  try {
    const data = fs.readFileSync(join(paths.config, 'config.yml'), {
      encoding: 'utf-8',
    })
    return yaml.safeLoad(data)
  } catch (e) {
    if (e.code === 'ENOENT') {
      log.error(
        `Couldn't find a config file in config directory: ${paths.config}`,
      )
    }
    process.exit(e.errno)
  }
}
