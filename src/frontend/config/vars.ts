import { isProd } from '../utils/env'

export const configVars = {
  baseUrl: isProd() ? 'https://hvjhdev.z6.web.core.windows.net' : '',
}
