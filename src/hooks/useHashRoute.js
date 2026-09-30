import { useCallback, useEffect, useState } from 'react'

/**
 * A tiny hash router: `#/quiz`, `#/result`, etc. Hash routing keeps V1 a static
 * site that works on any host with zero server config, and gives us a working
 * browser Back button for free.
 */
export const ROUTES = ['/', '/colleges', '/about', '/start', '/quiz', '/sorting', '/result']

function readRoute() {
  const path = window.location.hash.replace(/^#/, '').split('?')[0] || '/'
  return ROUTES.includes(path) ? path : '/'
}

export function navigate(path, { replace = false } = {}) {
  const hash = `#${path}`
  if (replace) window.history.replaceState(null, '', hash)
  else window.history.pushState(null, '', hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [])
  const go = useCallback((path, opts) => navigate(path, opts), [])
  return [route, go]
}
