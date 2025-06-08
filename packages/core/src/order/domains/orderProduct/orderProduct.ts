import type { Brand } from '@ecommerce/types'
import type { InventoryProductID } from '../../../inventory/domains'

const orderProductIdBrand: unique symbol = Symbol('OrderProductID')
export type OrderProductID = Brand<string, typeof orderProductIdBrand>
export const toOrderProductID = (maybeID: unknown) =>
  String(maybeID) as OrderProductID

export type OrderProduct = {
  id: OrderProductID
  name: string
  stock: number
  inventoryProductId: InventoryProductID
}
