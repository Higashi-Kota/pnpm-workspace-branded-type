import { env } from '@ecommerce/config'

import { toProductID as toProductID_B } from '@ecommerce/inventory/domains'
import {
  type ProductID as ProductID_A,
  toProductID as toProductID_A,
} from '@ecommerce/order/domains'

const idA = toProductID_A('PROD-123')
// @ts-expect-error demo
const _idB = toProductID_B('PROD-123')

// 型エラーが発生
const processId = (_id: ProductID_A) => {
  /* ... */
}
// processId(idB) // Type 'ProductID_B' is not assignable to type 'ProductID_A'
processId(idA)

export const App = () => (
  <div>
    <p>Cowboy</p>
    <div>{`Hello ${env.VITE_MODE.value}`}</div>
  </div>
)
