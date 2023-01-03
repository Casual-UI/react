/* eslint-disable no-console */
const path = require('path')
const { resolve } = require('path')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
const docgen = require('react-docgen-typescript')
const fg = require('fast-glob')
const flagRef = require('./flagRef')

const CWD_PATH = process.cwd()

const pluginName = 'casual-components-doc'

/**
 * @type {import('@docusaurus/types').PluginModule}
 */
const CasualComponentsDoc = async function (ctx) {
  const { generatedFilesDir } = ctx

  const CACHE_MAP_DIR = resolve(generatedFilesDir, `./${pluginName}/cache-map`)
  return {
    name: pluginName,
    async loadContent() {
      if (!existsSync(CACHE_MAP_DIR))
        mkdirSync(CACHE_MAP_DIR, { recursive: true })

      if (flagRef.value)
        return {}
      const files = await fg(['../ui/src/components/**/*.tsx'])

      return files
    },
    contentLoaded: async ({ content: files, actions: { createData } }) => {
      if (flagRef.value)
        return
      flagRef.value = true
      for (let i = 0; i < files.length; i++) {
        const filePath = files[i]
        const fileName = filePath.split('/').at(-1)
        const name = fileName.replace(/\.tsx/, '.json')
        const sourceFile = path.resolve(CWD_PATH, filePath)

        const doCreate = async () => {
          await createData(name, JSON.stringify(docgen.parse(sourceFile, {
            shouldIncludePropTagMap: true,
          })))
        }
        const cacheFilePath = resolve(CACHE_MAP_DIR, `${name}.temp`)
        const hasCache = existsSync(cacheFilePath)
        const sourceCode = readFileSync(sourceFile)
        if (!hasCache) {
          console.log('[Casual doc] file: \n', fileName, '\nHas no cache. Create it')

          // add cache if there's no cache
          writeFileSync(cacheFilePath, sourceCode, 'utf-8')
          await doCreate()
          continue
        }
        const cachedFileContent = readFileSync(cacheFilePath)
        if (!sourceCode.equals(cachedFileContent)) {
          console.log('[Casual doc] file: \n', fileName, '\nSource code changed. Update it')
          writeFileSync(cacheFilePath, sourceCode, 'utf-8')
          await doCreate()
          continue
        }
        else if (!existsSync(resolve(generatedFilesDir, `./${pluginName}/default/${name}`))) {
          console.log('[Casual doc] file: \n', fileName, '\n Has no json. Create it')
          await doCreate()
          continue
        }
        console.log('[Casual doc] file ', fileName, 'has cache. Use it')
      }
    },
  }
}

module.exports = CasualComponentsDoc
