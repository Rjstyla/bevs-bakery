import { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../server/storage'
import { insertOrderSchema } from '../../../shared/schema'
import { fromZodError } from 'zod-validation-error'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const validatedData = insertOrderSchema.parse(req.body)
      const order = await storage.createOrder(validatedData)
      res.status(201).json(order)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: fromZodError(error).toString()
        })
      }
      console.error('Error creating order:', error)
      res.status(500).json({ error: 'Failed to create order' })
    }
  } else if (req.method === 'GET') {
    try {
      const orders = await storage.getAllOrders()
      res.json(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      res.status(500).json({ error: 'Failed to fetch orders' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}