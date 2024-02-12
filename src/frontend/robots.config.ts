import { isProd } from '@/utils/env'
export default [{ UserAgent: '*' }, { Disallow: !isProd() ? '/*' : '/api/*' }] // TODO: check of die API map er wel komt
