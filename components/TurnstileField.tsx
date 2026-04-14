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
  onStatusChange?: (status: TurnstileStatus, message?: string | null) => void
  resetKey?: number
  theme?: 'light' | 'dark' | 'auto'
  className?: string
}

export type TurnstileStatus =
  | 'loading'
  | 'ready'
  | 'verified'
  | 'expired'
  | 'error'

export default function TurnstileField({
  onTokenChange,
  onStatusChange,
  resetKey = 0,
  theme = 'dark',
  className = '',
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const pollTimerRef = useRef<number | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [siteKey, setSiteKey] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('Loading spam protection...')

  const updateStatus = (status: TurnstileStatus, message?: string | null) => {
    const nextMessage =
      message ??
      (status === 'loading'
        ? 'Loading spam protection...'
        : status === 'ready'
          ? 'Complete the spam check to enable submission.'
          : status === 'verified'
            ? 'Spam protection complete.'
            : status === 'expired'
              ? 'Spam check expired. Please retry before submitting.'
              : 'Spam protection could not load. Please refresh or try again.')

    setStatusMessage(nextMessage)
    onStatusChange?.(status, nextMessage)
  }

  useEffect(() => {
    let cancelled = false

    async function fetchSiteKey() {
      updateStatus('loading')
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
            updateStatus('loading', 'Preparing spam protection...')
          } else {
            setLoadError('Spam protection is not configured yet.')
            console.error('[Turnstile] Site key route returned an empty value.')
            updateStatus('error', 'Spam protection is not configured yet.')
          }
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Could not load spam protection.'
          setLoadError(message)
          console.error('[Turnstile] Failed to fetch site key.', error)
          updateStatus('error', message)
        }
      }
    }

    fetchSiteKey()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        window.clearTimeout(pollTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!siteKey || scriptReady) {
      return
    }

    let attempts = 0

    const waitForTurnstile = () => {
      if (window.turnstile) {
        setScriptReady(true)
        updateStatus('loading', 'Preparing spam protection...')
        return
      }

      attempts += 1
      if (attempts >= 20) {
        setLoadError('Spam protection script did not finish loading.')
        console.error('[Turnstile] Cloudflare script never exposed window.turnstile.')
        updateStatus('error', 'Spam protection script did not finish loading. Please refresh and try again.')
        return
      }

      pollTimerRef.current = window.setTimeout(waitForTurnstile, 250)
    }

    waitForTurnstile()
  }, [scriptReady, siteKey])

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || widgetIdRef.current) {
      return
    }

    if (!window.turnstile) {
      setLoadError('Spam protection script did not initialize.')
      console.error('[Turnstile] Script loaded but window.turnstile is unavailable.')
      updateStatus('error', 'Spam protection script did not initialize.')
      return
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: (token) => {
          onTokenChange(token)
          updateStatus('verified')
        },
        'expired-callback': () => {
          onTokenChange(null)
          console.warn('[Turnstile] Verification expired before submission.')
          updateStatus('expired')
        },
        'error-callback': () => {
          onTokenChange(null)
          console.error('[Turnstile] Widget returned an error callback.')
          updateStatus('error', 'Spam protection check failed. Please refresh and try again.')
        },
      })
      setLoadError(null)
      updateStatus('ready')
    } catch (error) {
      setLoadError('Spam protection could not render.')
      console.error('[Turnstile] Failed to render widget.', error)
      updateStatus('error', 'Spam protection could not render. Please refresh and try again.')
    }
  }, [onTokenChange, scriptReady, siteKey, theme])

  useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) {
      return
    }

    window.turnstile.reset(widgetIdRef.current)
    onTokenChange(null)
    updateStatus('ready')
  }, [onTokenChange, resetKey])

  return (
    <div className={className}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          updateStatus('loading', 'Preparing spam protection...')
        }}
        onError={() => {
          setLoadError('Spam protection script failed to load.')
          console.error('[Turnstile] Failed to load Cloudflare script.')
          updateStatus('error', 'Spam protection script failed to load. Please refresh and try again.')
        }}
      />

      <div ref={containerRef} className="min-h-[65px]" />

      {loadError ? (
        <p className="mt-2 text-xs text-red-400">{loadError}</p>
      ) : (
        <p className="mt-2 text-xs text-white/35">{statusMessage}</p>
      )}
    </div>
  )
}
