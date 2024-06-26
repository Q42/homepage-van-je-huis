type SlugifyConfig = {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
};

const removeRegex = /['".]/g;

type SlugifyFunction = (string: string, options?: SlugifyConfig) => string;

export const defaultSlugifyConfig: SlugifyConfig = {
  lower: true,
  replacement: "_",
  trim: true,
  remove: removeRegex,
};

export function slugifyStreetName(
  slugifyFunction: SlugifyFunction,
  streetName: string
): string {
  return slugifyFunction(streetName, defaultSlugifyConfig);
}

export function slugifyAddress(
  slugifyFunction: SlugifyFunction,
  streetName: string,
  houseNumber: string
): string {
  return slugifyFunction(streetName + "-" + houseNumber, defaultSlugifyConfig);
}
