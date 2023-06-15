import { Dish, Order } from '@prisma/client'
import randomColor from 'randomcolor'

interface IOrdersReducer {
  labels: string[]
  values: number[]
  backgrounds: string[]
}

export const ordersReducer = (
  data: (Order & { dish: Dish })[],
): IOrdersReducer => {
  const ordersCount: Record<string, number> = data.reduce((acc, order) => {
    const { title } = order.dish
    if (acc[title]) {
      acc[title] += 1
    } else {
      acc[title] = 1
    }
    return acc
  }, {})

  const labels = Object.keys(ordersCount)
  const values = Object.values(ordersCount) as number[]

  const backgrounds: string[] = []

  labels.forEach((item) =>
    backgrounds.push(`${randomColor({ format: 'rgba' })}`),
  )

  return { labels, values, backgrounds }
}
