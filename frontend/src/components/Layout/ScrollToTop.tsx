import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop
 * - sets history.scrollRestoration to manual to avoid browser auto-restoring position
 * - scrolls to top on pathname changes
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual'
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    // Ensure we start at the top on every navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default ScrollToTop
