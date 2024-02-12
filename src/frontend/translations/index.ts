import { NestedKeys } from 'nested-object-access'
import { nl } from './nl'

export const translations = {
  nl,
}

export const getTranslationKey = (key: NestedKeys<typeof nl, 'primitives'>) => {
  return key
}
