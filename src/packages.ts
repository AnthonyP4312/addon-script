export interface Package {
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
