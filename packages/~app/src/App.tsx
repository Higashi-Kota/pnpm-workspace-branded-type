import { env } from '@ecommerce/config'
import {
  type InventoryProduct,
  toInventoryProductID,
} from '@ecommerce/core/inventory/domains'
import {
  type OrderProduct,
  type OrderProductID,
  toOrderProductID,
} from '@ecommerce/core/order/domains'
import { InventoryProductList } from '@ecommerce/inventory/components'
import { OrderProductList } from '@ecommerce/order/components'

// @ts-expect-error demo
const _orderProduct: OrderProduct = {
  id: toOrderProductID('op-1'),
  name: 'xxx',
  stock: 1,
  inventoryProductId: toInventoryProductID('ip-1'),
}

// @ts-expect-error demo
const _inventoryProduct: InventoryProduct = {
  id: toInventoryProductID('ip-1'),
  name: 'yyy',
  stock: 2,
  orderProductId: toOrderProductID('op-1'),
}

const idA = toOrderProductID('PROD-123')
// @ts-expect-error demo
const _idB = toInventoryProductID('PROD-123')

// 型エラーが発生
const processId = (_id: OrderProductID) => {
  /* ... */
}
// processId(_idB) // 型 InventoryProductID の引数を型 OrderProductID のパラメーターに割り当てることはできません。
processId(idA)

export const App = () => (
  <div>
    <p>Cowboy</p>
    <div>{`Hello ${env.VITE_MODE.value}`}</div>
    <InventoryProductList />
    <OrderProductList />
  </div>
)
