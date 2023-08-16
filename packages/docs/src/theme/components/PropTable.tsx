/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import { CTable } from '@casual-ui/react'
import type {
  CTableColumn,
  CustomRender,
} from '@site/../ui/src/components/table/CTable'
import type { PropItem } from 'react-docgen-typescript'
import { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Highlight, themes } from 'prism-react-renderer'
import { useColorMode } from '@docusaurus/theme-common'

interface PropTableProps {
  name: string
  typeWidth?: string
}

const localeMap = {
  'zh-CN': 'zh',
}

function PropTable({ name, typeWidth = '200px' }: PropTableProps) {
  const { colorMode } = useColorMode()
  const typeRender: CustomRender = ({ val }: any) => {
    const code = new Map([
      ['CTheme', `  | 'primary' 
  | 'secondary' 
  | 'warning' 
  | 'negative'`],
      ['CSize', '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\''],
    ]).get(val.name) || val.name

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      <Highlight code={code} language="typescript" theme={colorMode === 'dark' ? themes.palenight : themes.vsLight}>
         {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })} style={{ whiteSpace: 'pre-wrap' }}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </div>
            ))}
          </pre>
         )}
      </Highlight>
    )
  }

  const { i18n } = useDocusaurusContext()
  const columns: CTableColumn<PropItem>[] = [
    {
      title: translate({
        id: 'propTable.name',
        message: 'Name',
      }),
      field: 'name',
      width: '200px',
      customHeader: ({ title }) => <span>{title} (<b className="c-text-negative">*</b>{translate({
        id: 'propTable.required',
        message: 'for required',
      })})</span>,
      customRender: ({ val, row }) => row.required ? <span>{val}<b className="c-text-negative">*</b></span> : val,
    },
    {
      title: translate({
        id: 'propTable.desc',
        message: 'Description',
      }),
      field: 'description',
      customRender: ({ val, row }: any) => {
        const tagName = localeMap[i18n.currentLocale as 'zh-CN']
        return (
          <div
            dangerouslySetInnerHTML={{
              __html:
                i18n.currentLocale === 'en'
                  ? val
                  : tagName
                    ? row.tags[tagName]
                      ? row.tags[tagName]
                      : `Please add @${tagName} to source code`
                    : '',
            }}
          ></div>
        )
      },
    },
    {
      title: translate({
        id: 'propTable.type',
        message: 'Type',
      }),
      field: 'type',
      customRender: typeRender,
      width: typeWidth,
    },
    {
      title: translate({
        id: 'propTable.defaultValue',
        message: 'Default Value',
      }),
      field: 'defaultValue',
      width: '120px',
      customRender: ({ val }: any) => {
        return val === null
          ? (
              '-'
            )
          : (
          <code>
            {new Map<boolean | string, string>([
              [true, 'true'],
              [false, 'false'],
              ['', '\'\''],
            ]).get(val.value) || val.value}
          </code>
            )
      },
    },
  ]
  const [data, setData] = useState([])

  useEffect(() => {
    if (name) {
      import(
        `@site/.docusaurus/casual-components-doc/default/${name}.json`
      ).then((r) => {
        setData(Object.values(r.default[0].props))
      })
    }
  }, [name])

  return (
    <CTable<PropItem>
      data={data}
      columns={columns}
      rowKey="name"
    />
  )
}

export default PropTable
