/* eslint-disable react/prop-types */
import React from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { usePrismTheme } from '@docusaurus/theme-common'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { CExpansion } from '@casual-ui/react'
import { translate } from '@docusaurus/Translate'
import ReactIcon from '../components/ReactIcon'
import styles from './styles.module.css'

function LivePreviewLoader() {
  // Is it worth improving/translating?
  return <div>Loading...</div>
}

function ResultWithHeader() {
  return (
    <>
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

export default function Playground({ children, transformCode, ...props }) {
  const {
    siteConfig: {
      themeConfig: {
        liveCodeBlock: { playgroundPosition },
      },
    },
  } = useDocusaurusContext()
  const prismTheme = usePrismTheme()

  return (
    <div className={styles.playgroundContainer}>
      <LiveProvider
        code={children.replace(/\n$/, '')}
        transformCode={transformCode || (code => `${code};`)}
        theme={prismTheme}
        {...props}
      >
        {playgroundPosition === 'top'
          ? (
          <>
            <ResultWithHeader />
            <ThemedLiveEditor />
          </>
            )
          : (
          <>
            <ThemedLiveEditor />
            <ResultWithHeader />
          </>
            )}
      </LiveProvider>
    </div>
  )
}
