import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  await prisma.occasion.upsert({
    where: { name: 'Birthday' },
    update: {},
    create: { name: 'Birthday', isBuiltIn: true },
  })

  await prisma.occasion.upsert({
    where: { name: 'Christmas' },
    update: {},
    create: { name: 'Christmas', isBuiltIn: true },
  })

  console.log('Seeded occasions: Birthday, Christmas')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
