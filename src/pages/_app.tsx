import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import '../styles/globals.css'
import CookieBanner from '../components/CookieBanner'

// ── Substitua pelos seus IDs reais ───────────────────────────────────────────
const GA4_ID = 'G-XXXXXXXXXX'          // Google Analytics 4 — substitua pelo seu ID
const META_PIXEL_ID = 'XXXXXXXXXXXXXXX' // Meta Pixel — substitua pelo seu ID
// ────────────────────────────────────────────────────────────────────────────

export default function App({ Component, pageProps }: AppProps) {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent')
    if (stored !== null) setConsent(stored === 'true')
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true')
    setConsent(true)
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'false')
    setConsent(false)
  }

  return (
    <>
      {/* Google Analytics 4 — carregado apenas com consentimento */}
      {consent === true && GA4_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', { anonymize_ip: true });
          `}</Script>
        </>
      )}

      {/* Meta Pixel — carregado apenas com consentimento */}
      {consent === true && META_PIXEL_ID !== 'XXXXXXXXXXXXXXX' && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      <Component {...pageProps} />

      {/* Banner de cookies — exibido apenas se não houver escolha */}
      {consent === null && (
        <CookieBanner onAccept={handleAccept} onReject={handleReject} />
      )}
    </>
  )
}
