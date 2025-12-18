import { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../../server/storage'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const order = await storage.getOrder(id as string)
      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }
      res.json(order)
    } catch (error) {
      console.error('Error fetching order:', error)
      res.status(500).json({ error: 'Failed to fetch order' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}