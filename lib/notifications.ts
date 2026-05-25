import { prisma } from './prisma'

export interface Notification {
  personId: string
  personName: string
  occasionName: string
  daysUntil: number
  giftIdeas: { id: string; title: string; status: string }[]
}

function nextOccurrence(month: number, day: number, from: Date): Date {
  const result = new Date(from.getFullYear(), month - 1, day)
  if (result <= from) result.setFullYear(result.getFullYear() + 1)
  return result
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export async function getNotifications(): Promise<Notification[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const windowEnd = new Date(today)
  windowEnd.setDate(windowEnd.getDate() + 30)

  const people = await prisma.person.findMany({
    include: {
      giftIdeas: { select: { id: true, title: true, status: true, occasionId: true } },
      events: { include: { occasion: true } },
    },
  })

  const christmasOccasion = await prisma.occasion.findUnique({ where: { name: 'Christmas' } })
  const birthdayOccasion = await prisma.occasion.findUnique({ where: { name: 'Birthday' } })

  const notifications: Notification[] = []
  const isChristmasSeason = today.getMonth() === 11 && today.getDate() >= 1 && today.getDate() <= 24

  for (const person of people) {
    // Birthday notification
    if (person.birthday && birthdayOccasion) {
      const bday = new Date(person.birthday)
      const next = nextOccurrence(bday.getMonth() + 1, bday.getDate(), today)
      const days = daysBetween(today, next)
      if (days <= 30) {
        const ideas = person.giftIdeas.filter(
          (g) => g.occasionId === birthdayOccasion.id || g.occasionId === null
        )
        notifications.push({
          personId: person.id,
          personName: person.name,
          occasionName: 'Birthday',
          daysUntil: days,
          giftIdeas: ideas,
        })
      }
    }

    // Custom events in the next 30 days
    for (const event of person.events) {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const days = daysBetween(today, eventDate)
      if (days >= 0 && days <= 30) {
        const ideas = person.giftIdeas.filter((g) => g.occasionId === event.occasionId)
        notifications.push({
          personId: person.id,
          personName: person.name,
          occasionName: event.occasion.name,
          daysUntil: days,
          giftIdeas: ideas,
        })
      }
    }

    // Christmas season notification
    if (isChristmasSeason && christmasOccasion) {
      const ideas = person.giftIdeas.filter((g) => g.occasionId === christmasOccasion.id)
      notifications.push({
        personId: person.id,
        personName: person.name,
        occasionName: 'Christmas',
        daysUntil: daysBetween(today, new Date(today.getFullYear(), 11, 25)),
        giftIdeas: ideas,
      })
    }
  }

  return notifications
}
