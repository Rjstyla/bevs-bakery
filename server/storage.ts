import { type InsertOrder, type Order, orders } from '../shared/schema'
import { db } from '../lib/db'
import { eq, desc } from 'drizzle-orm'

export const storage = {
  async createOrder(data: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...data,
        status: 'pending'
      })
      .returning()
    return order
  },

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
  },

  async getOrder(id: string): Promise<Order | null> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
    return order || null
  },
}

export default storage
