export function isProd() {
  return process.env.ENVIRONMENT === 'production'
}
