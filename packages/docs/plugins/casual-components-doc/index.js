/* eslint-disable no-console */
const path = require('path')
const { resolve } = require('path')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
const pc = require('picocolors')
const docgen = require('react-docgen-typescript')
const fg = require('fast-glob')
const prettier = require('prettier')
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
    contentLoaded: async ({ content: files, actions: { createData, setGlobalData } }) => {
      if (flagRef.value)
        return
      flagRef.value = true
      const globalData = {}
      for (let i = 0; i < files.length; i++) {
        const filePath = files[i]
        const fileName = filePath.split('/').at(-1)
        const name = fileName.replace(/\.tsx/, '.json')
        const sourceFile = path.resolve(CWD_PATH, filePath)
        const doCreate = async () => {
          const apiObj = docgen.parse(sourceFile, {
            shouldIncludePropTagMap: true,
          })
          apiObj.forEach((apiItem) => {
            Object.values(apiItem.props).forEach((prop) => {
              prop.type.name = prettier
                .format(
                  `type Type1 = ${prop.type.name}`,
                  {
                    parser: 'typescript',
                    semi: false,
                    singleQuote: true,
                    trailingComma: 'es5',
                    printWidth: 40,
                  },
                )
                .replace(/type Type1 = ?\n?/, '')
                .replace(/[\r\n]+$/, '')
            })
          })
          await createData(name, JSON.stringify(apiObj))
          globalData[name] = apiObj
        }
        const cacheFilePath = resolve(CACHE_MAP_DIR, `${name}.temp`)
        const hasCache = existsSync(cacheFilePath)
        const sourceCode = readFileSync(sourceFile)
        if (!hasCache) {
          console.log(pc.magenta(`[Casual doc] file: ${fileName} has no cache. Create it`))

          // add cache if there's no cache
          writeFileSync(cacheFilePath, sourceCode, 'utf-8')
          await doCreate()
          continue
        }
        const cachedFileContent = readFileSync(cacheFilePath)
        const jsonPath = resolve(generatedFilesDir, `./${pluginName}/default/${name}`)
        if (!sourceCode.equals(cachedFileContent)) {
          console.log(pc.cyan(`[Casual doc] file: ${fileName} source code changed. Update it`))
          writeFileSync(cacheFilePath, sourceCode, 'utf-8')
          await doCreate()
          continue
        }
        else if (!existsSync(jsonPath)) {
          console.log(pc.green(`[Casual doc] file: ${fileName} has no json. Create it`))
          await doCreate()
          continue
        }
        globalData[name] = JSON.parse(readFileSync(jsonPath, 'utf-8'))
        console.log(pc.gray(`[Casual doc] file: ${fileName} has cache. Use it`))
      }
      setGlobalData(globalData)
    },
  }
}

module.exports = CasualComponentsDoc
