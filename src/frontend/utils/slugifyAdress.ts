import slugify from 'slugify'

type SlugifyConfig = {
  replacement?: string
  remove?: RegExp
  lower?: boolean
  strict?: boolean
  locale?: string
  trim?: boolean
}

export const defaultSlugifyConfig: SlugifyConfig = {
  lower: true,
  replacement: '_',
  trim: true,
}

export const slugifyAddress = (streetName: string, houseNumber: string) => {
  return slugify(streetName + '-' + houseNumber, defaultSlugifyConfig)
}
