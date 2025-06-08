import type { Brand } from '@ecommerce/types'
import type { OrderProductID } from '../../../order/domains'

const inventoryProductIdBrand: unique symbol = Symbol('InventoryProductID')
export type InventoryProductID = Brand<string, typeof inventoryProductIdBrand>
export const toInventoryProductID = (maybeID: unknown) =>
  String(maybeID) as InventoryProductID

export type InventoryProduct = {
  id: InventoryProductID
  name: string
  stock: number
  orderProductId: OrderProductID
}
