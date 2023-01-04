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
import Highlight, { defaultProps } from 'prism-react-renderer'
interface PropTableProps {
  name: string
  typeWidth?: string
}

const localeMap = {
  'zh-CN': 'zh',
}

export const PropTable = ({ name, typeWidth = '200px' }: PropTableProps) => {
  const typeRender: CustomRender = ({ val }: any) => {
    const code = new Map([
      ['CTheme', '\'primary\' | \'secondary\' | \'warning\' | \'negative\''],
      ['CSize', '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\''],
    ]).get(val.name) || val.name

    return (
      <Highlight {...defaultProps} code={code} language="typescript">
         {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
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
      width: '120px',
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
        id: 'propTable.required',
        message: 'Required',
      }),
      field: 'required',
      customRender: ({ val }: any) =>
        val
          ? translate({
            id: 'propTable.required.yes',
            message: 'Yes',
          })
          : translate({
            id: 'propTable.required.no',
            message: 'No',
          }),
      width: '100px',
    },
    {
      title: translate({
        id: 'propTable.defaultValue',
        message: 'Default Value',
      }),
      field: 'defaultValue',
      width: '100px',
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
