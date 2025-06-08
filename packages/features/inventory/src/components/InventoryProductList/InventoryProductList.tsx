import {
  type InventoryProduct,
  toInventoryProductID,
} from '@ecommerce/core/inventory/domains'
import { toOrderProductID } from '@ecommerce/core/order/domains'

const inventoryData: InventoryProduct[] = [
  {
    id: toInventoryProductID('inv-001'),
    name: 'Apple iPhone 15',
    stock: 25,
    orderProductId: toOrderProductID('ord-001'),
  },
  {
    id: toInventoryProductID('inv-002'),
    name: 'Samsung Galaxy S23',
    stock: 15,
    orderProductId: toOrderProductID('ord-002'),
  },
  {
    id: toInventoryProductID('inv-003'),
    name: 'Sony WH-1000XM5 Headphones',
    stock: 40,
    orderProductId: toOrderProductID('ord-003'),
  },
]

export const InventoryProductList = () => {
  return (
    <div>
      <h2>Inventory Product List</h2>
      <ul>
        {inventoryData.map((product) => (
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
              <strong>Order Product ID:</strong>{' '}
              {String(product.orderProductId)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
