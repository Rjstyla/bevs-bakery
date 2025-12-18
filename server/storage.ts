import type { InsertOrder, Order } from '../shared/schema'

type InMemoryOrder = Order & { createdAt: string }

const orders: InMemoryOrder[] = []

export const storage = {
  async createOrder(data: InsertOrder): Promise<Order> {
    const order: any = {
      id: (Math.random().toString(36).slice(2, 10)),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    orders.unshift(order)
    return order
  },

  async getAllOrders(): Promise<Order[]> {
    return orders
  },

  async getOrder(id: string): Promise<Order | null> {
    const o = orders.find((x) => x.id === id)
    return o || null
  },
}

export default storage
