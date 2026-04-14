'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

interface TurnstileFieldProps {
  onTokenChange: (token: string | null) => void
  resetKey?: number
  theme?: 'light' | 'dark' | 'auto'
  className?: string
}

export default function TurnstileField({
  onTokenChange,
  resetKey = 0,
  theme = 'dark',
  className = '',
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [siteKey, setSiteKey] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSiteKey() {
      try {
        const response = await fetch('/api/turnstile/site-key', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Could not load spam protection.')
        }

        const data = await response.json()
        if (!cancelled) {
          if (data.siteKey) {
            setSiteKey(data.siteKey)
            setLoadError(null)
          } else {
            setLoadError('Spam protection is not configured yet.')
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Could not load spam protection.')
        }
      }
    }

    fetchSiteKey()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || widgetIdRef.current || !window.turnstile) {
      return
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token) => onTokenChange(token),
      'expired-callback': () => onTokenChange(null),
      'error-callback': () => onTokenChange(null),
    })
  }, [onTokenChange, scriptReady, siteKey, theme])

  useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) {
      return
    }

    window.turnstile.reset(widgetIdRef.current)
    onTokenChange(null)
  }, [onTokenChange, resetKey])

  return (
    <div className={className}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div ref={containerRef} className="min-h-[65px]" />

      {loadError ? (
        <p className="mt-2 text-xs text-red-400">{loadError}</p>
      ) : (
        <p className="mt-2 text-xs text-white/35">Protected by Cloudflare Turnstile</p>
      )}
    </div>
  )
}
