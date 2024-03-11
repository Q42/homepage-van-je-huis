export function isMobile(screenWidth: number) {
  return screenWidth < 320
}

export function isTablet(screenWidth: number) {
  return screenWidth < 600
}

export function isDesktopMd(screenWidth: number) {
  return screenWidth < 1024
}

export function isDesktopLg(screenWidth: number) {
  return screenWidth < 1360
}

export function isDesktopXl(screenWidth: number) {
  return screenWidth < 1920
}

export function isSafariOniPhone() {
  const userAgent = window.navigator.userAgent
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
  const isiPhone = /iPhone/i.test(userAgent)

  return isSafari && isiPhone
}
