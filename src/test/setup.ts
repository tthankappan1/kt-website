import '@testing-library/jest-dom/vitest'

// jsdom does not implement window.matchMedia. Provide a default stub
// (prefers-reduced-motion: NOT set) so components that query motion preference
// render under test. Individual tests may override window.matchMedia as needed.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
