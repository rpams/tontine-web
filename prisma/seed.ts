import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'jean.dupont@example.com' },
    update: {},
    create: {
      id: 'user_sample_1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      telephone: '+229 97 12 34 56',
      address: 'Quartier Fidjrossè, Cotonou, Bénin',
      emailVerified: true,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'marie.kouadio@example.com' },
    update: {},
    create: {
      id: 'user_sample_2',
      name: 'Marie KOUADIO',
      email: 'marie.kouadio@example.com',
      telephone: '+225 07 12 34 56',
      emailVerified: true,
    },
  })

  console.log('✅ Users created:', { user1: user1.name, user2: user2.name })
  
  // Create sample tontine
  const tontine = await prisma.tontine.create({
    data: {
      name: 'Tontine Famille',
      description: 'Épargne familiale mensuelle',
      amountPerRound: 85000,
      totalAmountPerRound: 85000,
      frequencyType: 'MONTHLY',
      frequencyValue: 1,
      status: 'ACTIVE',
      startDate: new Date(),
      maxParticipants: 12,
      creatorId: user1.id,
    },
  })

  console.log('✅ Tontine created:', tontine.name)
  
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })