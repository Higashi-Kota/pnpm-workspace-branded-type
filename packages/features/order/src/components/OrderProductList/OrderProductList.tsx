import { toInventoryProductID } from '@ecommerce/core/inventory/domains'
import {
  type OrderProduct,
  toOrderProductID,
} from '@ecommerce/core/order/domains'

const orderData: OrderProduct[] = [
  {
    id: toOrderProductID('ord-001'),
    name: 'Apple iPhone 15',
    stock: 2,
    inventoryProductId: toInventoryProductID('inv-001'),
  },
  {
    id: toOrderProductID('ord-002'),
    name: 'Samsung Galaxy S23',
    stock: 1,
    inventoryProductId: toInventoryProductID('inv-002'),
  },
  {
    id: toOrderProductID('ord-003'),
    name: 'Sony WH-1000XM5 Headphones',
    stock: 3,
    inventoryProductId: toInventoryProductID('inv-003'),
  },
  {
    id: toOrderProductID('ord-004'),
    name: 'Google Pixel 8',
    stock: 5,
    inventoryProductId: toInventoryProductID('inv-004'),
  },
  {
    id: toOrderProductID('ord-005'),
    name: 'Apple Watch Series 9',
    stock: 4,
    inventoryProductId: toInventoryProductID('inv-005'),
  },
]

export const OrderProductList = () => {
  return (
    <div>
      <h2>Order Product List</h2>
      <ul>
        {orderData.map((product) => (
          <li key={String(product.id)}>
            <div>
              <strong>ID:</strong> {String(product.id)}
            </div>
            <div>
              <strong>Name:</strong> {product.name}
            </div>
            <div>
              <strong>Stock:</strong> {product.stock}
            </div>
            <div>
              <strong>Inventory Product ID:</strong>{' '}
              {String(product.inventoryProductId)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
