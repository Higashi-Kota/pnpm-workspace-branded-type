import type { Brand } from '@ecommerce/types'

const productIdBrand: unique symbol = Symbol('InventoryProductID')
export type ProductID = Brand<string, typeof productIdBrand>
export const toProductID = (maybeID: unknown) => String(maybeID) as ProductID
