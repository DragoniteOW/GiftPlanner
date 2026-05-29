import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  await prisma.occasion.upsert({
    where: { name: 'Geburtstag' },
    update: {},
    create: { name: 'Geburtstag', isBuiltIn: true },
  })

  await prisma.occasion.upsert({
    where: { name: 'Weihnachten' },
    update: {},
    create: { name: 'Weihnachten', isBuiltIn: true },
  })

  console.log('Seeded occasions: Geburtstag, Weihnachten')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
