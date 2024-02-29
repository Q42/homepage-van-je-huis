import slugify from 'slugify'

type SlugifyConfig = {
  replacement?: string
  remove?: RegExp
  lower?: boolean
  strict?: boolean
  locale?: string
  trim?: boolean
}

const removeRegex = /['".]/g

export const defaultSlugifyConfig: SlugifyConfig = {
  lower: true,
  replacement: '_',
  trim: true,
  remove: removeRegex,
}

export const slugifyStreetName = (streetName: string) => {
  return slugify(streetName, defaultSlugifyConfig)
}

export const slugifyAddress = (streetName: string, houseNumber: string) => {
  return slugify(streetName + '-' + houseNumber, defaultSlugifyConfig)
}

export const slugToAddress = (slug: string) => {
  return 'Straatnaam 1'
}
