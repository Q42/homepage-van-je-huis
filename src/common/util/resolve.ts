type SlugifyConfig = {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
};

type SlugifyFunction = (string: string, options?: SlugifyConfig) => string;

export const defaultSlugifyConfig: SlugifyConfig = {
  lower: true,
  replacement: "_",
  trim: true,
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
