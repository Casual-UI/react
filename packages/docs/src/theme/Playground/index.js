import React from 'react'
import clsx from 'clsx'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import Translate, { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { usePrismTheme } from '@docusaurus/theme-common'
import { CExpansion } from '@casual-ui/react'
import ReactIcon from '../components/ReactIcon'
import styles from './styles.module.css'

function Header({ children }) {
  return <div className={clsx(styles.playgroundHeader)}>{children}</div>
}
function LivePreviewLoader() {
  // Is it worth improving/translating?
  // eslint-disable-next-line @docusaurus/no-untranslated-text
  return <div>Loading...</div>
}
function ResultWithHeader() {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.result"
          description="The result label of the live codeblocks">
          Result
        </Translate>
      </Header>
      {/* https://github.com/facebook/docusaurus/issues/5747 */}
      <div className={styles.playgroundPreview}>
        <BrowserOnly fallback={<LivePreviewLoader />}>
          {() => (
            <>
              <LivePreview />
              <LiveError />
            </>
          )}
        </BrowserOnly>
      </div>
    </>
  )
}
function ThemedLiveEditor() {
  const isBrowser = useIsBrowser()

  return (
    <CExpansion
      headerStyle={{
        fontSize: '12px',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
      }}
      title={
        <div className="c-flex c-items-center">
          <ReactIcon style={{ fontSize: '18px', color: '#61DAFB' }} className="c-mr-md" />
          {translate({
            id: 'codeExpansion.title',
            message: 'Fold/Expand Code',
          })}
        </div>
      }
      open={false}
      reverse
    >
      <LiveEditor
        key={isBrowser}
        className={styles.playgroundEditor}
      />
    </CExpansion>
  )
}

function EditorWithHeader() {
  return (
    <>
      <Header>
        <Translate
          id="theme.Playground.liveEditor"
          description="The live editor label of the live codeblocks">
          Live Editor
        </Translate>
      </Header>
      <ThemedLiveEditor />
    </>
  )
}
export default function Playground({ children, transformCode, ...props }) {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext()
  const {
    liveCodeBlock: { playgroundPosition },
  } = themeConfig
  const prismTheme = usePrismTheme()
  const noInline = props.metastring?.includes('noInline') ?? false
  return (
    <div className={styles.playgroundContainer}>
      {/* @ts-expect-error: type incompatibility with refs */}
      <LiveProvider
        code={children.replace(/\n$/, '')}
        noInline={noInline}
        transformCode={transformCode ?? (code => `${code};`)}
        theme={prismTheme}
        {...props}>
        {playgroundPosition === 'top'
          ? (
          <>
            <ResultWithHeader />
            <EditorWithHeader />
          </>
            )
          : (
          <>
            <EditorWithHeader />
            <ResultWithHeader />
          </>
            )}
      </LiveProvider>
    </div>
  )
}
