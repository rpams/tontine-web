import { PrismaClient } from '../lib/generated/prisma'
import { auth } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Helper function to create better-auth compatible users
  const createUser = async (userData: any) => {
    console.log(`Creating user: ${userData.email}`)

    try {
      // Supprimer l'utilisateur s'il existe déjà (pour permettre de relancer le seed)
      try {
        const existingUser = await prisma.user.findUnique({ where: { email: userData.email } })
        if (existingUser) {
          await prisma.user.delete({ where: { email: userData.email } })
          console.log(`Deleted existing user ${userData.email}`)
        }
      } catch (e) {
        // L'utilisateur n'existe pas, c'est normal
      }

      // Utiliser better-auth pour créer l'utilisateur (gère le hashage automatiquement)
      const result = await auth.api.signUpEmail({
        body: {
          email: userData.email,
          password: userData.password || 'password123456',
          name: userData.name,
        }
      })

      if (!result.user) {
        throw new Error('Failed to create user with better-auth')
      }

      const user = result.user

      // Mettre à jour les informations supplémentaires
      await prisma.user.update({
        where: { id: user.id },
        data: {
          telephone: userData.telephone,
          address: userData.address,
          role: userData.role || 'USER',
          emailVerified: userData.emailVerified || false,
        }
      })

      // Vérifier si le profil n'existe pas déjà (better-auth le crée automatiquement)
      const existingProfile = await prisma.userProfile.findUnique({ where: { userId: user.id } })

      if (!existingProfile) {
        // Créer le profil utilisateur seulement s'il n'existe pas
        await prisma.userProfile.create({
          data: {
            userId: user.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.telephone,
            address: userData.address,
            city: userData.city,
            country: userData.country || 'Sénégal',
            preferredLanguage: 'fr',
            timezone: 'Africa/Dakar',
            isProfileComplete: userData.emailVerified || false,
          },
        })
      } else {
        // Mettre à jour le profil existant avec les données complètes
        await prisma.userProfile.update({
          where: { userId: user.id },
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.telephone,
            address: userData.address,
            city: userData.city,
            country: userData.country || 'Sénégal',
            isProfileComplete: userData.emailVerified || false,
          },
        })
      }

      // Créer la vérification d'identité
      if (userData.emailVerified) {
        await prisma.identityVerification.create({
          data: {
            userId: user.id,
            status: 'APPROVED',
            submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours avant
            reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 jours avant
            approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            documentType: 'CNI',
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
          },
        })
      } else {
        await prisma.identityVerification.create({
          data: {
            userId: user.id,
            status: 'NOT_STARTED',
          },
        })
      }

      console.log(`✅ User created: ${user.email} (${user.role})`)
      return user
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error)
      return null
    }
  }

  // 1. Créer les utilisateurs
  console.log('👥 Creating users...')

  // Admin user (vérifié)
  const admin = await createUser({
    name: 'Administrateur Système',
    email: 'admin@tontine.app',
    password: 'admin123456',
    firstName: 'Administrateur',
    lastName: 'Système',
    telephone: '+221 77 123 45 67',
    address: 'Plateau, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    role: 'ADMIN',
    emailVerified: true,
    gender: 'M',
    dateOfBirth: new Date('1985-03-15'),
  })

  // Users vérifiés (participent aux tontines)
  const amadou = await createUser({
    name: 'Amadou DIOP',
    email: 'amadou.diop@email.com',
    password: 'amadou123456',
    firstName: 'Amadou',
    lastName: 'DIOP',
    telephone: '+221 77 987 65 43',
    address: 'Médina, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    emailVerified: true,
    gender: 'M',
    dateOfBirth: new Date('1990-05-20'),
  })

  const fatou = await createUser({
    name: 'Fatou FALL',
    email: 'fatou.fall@email.com',
    password: 'fatou123456',
    firstName: 'Fatou',
    lastName: 'FALL',
    telephone: '+221 76 456 78 90',
    address: 'Yoff, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    emailVerified: true,
    gender: 'F',
    dateOfBirth: new Date('1992-08-12'),
  })

  // Users non vérifiés (ne participent pas)
  const oumar = await createUser({
    name: 'Oumar NDIAYE',
    email: 'oumar.ndiaye@email.com',
    password: 'oumar123456',
    firstName: 'Oumar',
    lastName: 'NDIAYE',
    telephone: '+221 78 321 54 87',
    address: 'Parcelles Assainies, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    emailVerified: false,
    gender: 'M',
    dateOfBirth: new Date('1988-11-03'),
  })

  const awa = await createUser({
    name: 'Awa SARR',
    email: 'awa.sarr@email.com',
    password: 'awa123456',
    firstName: 'Awa',
    lastName: 'SARR',
    telephone: '+221 77 654 32 10',
    address: 'Grand Yoff, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    emailVerified: false,
    gender: 'F',
    dateOfBirth: new Date('1995-02-28'),
  })

  console.log('✅ Users created')

  // Vérifier que tous les utilisateurs ont été créés
  if (!admin || !amadou || !fatou || !oumar || !awa) {
    console.error('❌ Some users failed to create, aborting seed')
    return
  }

  // 2. Créer les tontines
  console.log('🎯 Creating tontines...')

  const tontine1 = await prisma.tontine.create({
    data: {
      name: 'Tontine Famille DIOP',
      description: 'Épargne familiale mensuelle pour les projets communs',
      amountPerRound: 50000, // 50 000 FCFA par tour
      totalAmountPerRound: 150000, // 3 participants × 50 000
      frequencyType: 'MONTHLY',
      frequencyValue: 1,
      status: 'ACTIVE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      maxParticipants: 3,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      creatorId: amadou.id,
    },
  })

  const tontine2 = await prisma.tontine.create({
    data: {
      name: 'Tontine Étudiants',
      description: 'Épargne entre amis étudiants pour financer les études',
      amountPerRound: 25000, // 25 000 FCFA par tour
      totalAmountPerRound: 50000, // 2 participants × 25 000
      frequencyType: 'WEEKLY',
      frequencyValue: 2, // Toutes les 2 semaines
      status: 'ACTIVE',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      maxParticipants: 2,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      creatorId: fatou.id,
    },
  })

  console.log('✅ Tontines created')

  // 3. Créer les participants
  console.log('👨‍👩‍👧‍👦 Creating participants...')

  // Participants tontine 1
  const participant1_1 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontine1.id,
      sharesCount: 1,
      totalCommitted: 150000, // 3 tours × 50 000
      isActive: true,
    },
  })

  const participant1_2 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontine1.id,
      sharesCount: 1,
      totalCommitted: 150000,
      isActive: true,
    },
  })

  const participant1_3 = await prisma.tontineParticipant.create({
    data: {
      userId: admin.id,
      tontineId: tontine1.id,
      sharesCount: 1,
      totalCommitted: 150000,
      isActive: true,
    },
  })

  // Participants tontine 2
  const participant2_1 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontine2.id,
      sharesCount: 1,
      totalCommitted: 50000, // 2 tours × 25 000
      isActive: true,
    },
  })

  const participant2_2 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontine2.id,
      sharesCount: 1,
      totalCommitted: 50000,
      isActive: true,
    },
  })

  console.log('✅ Participants created')

  // 4. Créer les tours/rounds
  console.log('🔄 Creating rounds...')

  // Tours tontine 1 (3 tours mensuels)
  const round1_1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontine1.id,
      roundNumber: 1,
      expectedAmount: 150000,
      collectedAmount: 150000,
      distributedAmount: 150000,
      dueDate: new Date('2025-01-31'),
      collectionStartDate: new Date('2025-01-01'),
      completedAt: new Date('2025-01-31'),
      status: 'COMPLETED',
      winnerId: participant1_1.id, // Amadou gagne le 1er tour
    },
  })

  const round1_2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontine1.id,
      roundNumber: 2,
      expectedAmount: 150000,
      collectedAmount: 100000, // Partiellement collecté
      distributedAmount: 0,
      dueDate: new Date('2025-02-28'),
      collectionStartDate: new Date('2025-02-01'),
      status: 'COLLECTING',
      winnerId: participant1_2.id, // Fatou gagnera le 2ème tour
    },
  })

  const round1_3 = await prisma.tontineRound.create({
    data: {
      tontineId: tontine1.id,
      roundNumber: 3,
      expectedAmount: 150000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-03-31'),
      collectionStartDate: new Date('2025-03-01'),
      status: 'PENDING',
      winnerId: participant1_3.id, // Admin gagnera le 3ème tour
    },
  })

  // Tours tontine 2 (2 tours bi-hebdomadaires)
  const round2_1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontine2.id,
      roundNumber: 1,
      expectedAmount: 50000,
      collectedAmount: 50000,
      distributedAmount: 50000,
      dueDate: new Date('2025-01-29'),
      collectionStartDate: new Date('2025-01-15'),
      completedAt: new Date('2025-01-29'),
      status: 'COMPLETED',
      winnerId: participant2_1.id, // Fatou gagne le 1er tour
    },
  })

  const round2_2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontine2.id,
      roundNumber: 2,
      expectedAmount: 50000,
      collectedAmount: 25000, // En cours de collecte
      distributedAmount: 0,
      dueDate: new Date('2025-02-12'),
      collectionStartDate: new Date('2025-01-29'),
      status: 'COLLECTING',
      winnerId: participant2_2.id, // Amadou gagnera le 2ème tour
    },
  })

  console.log('✅ Rounds created')

  // 5. Créer les paiements
  console.log('💳 Creating payments...')

  // Paiements pour round1_1 (complétés)
  await prisma.payment.create({
    data: {
      userId: amadou.id,
      participantId: participant1_1.id,
      roundId: round1_1.id,
      amount: 50000,
      status: 'PAID',
      dueDate: new Date('2025-01-31'),
      paidAt: new Date('2025-01-25'),
      paymentMethod: 'Mobile Money',
      transactionId: 'MM_001_20250125',
    },
  })

  await prisma.payment.create({
    data: {
      userId: fatou.id,
      participantId: participant1_2.id,
      roundId: round1_1.id,
      amount: 50000,
      status: 'PAID',
      dueDate: new Date('2025-01-31'),
      paidAt: new Date('2025-01-28'),
      paymentMethod: 'Virement bancaire',
      transactionId: 'VB_002_20250128',
    },
  })

  await prisma.payment.create({
    data: {
      userId: admin.id,
      participantId: participant1_3.id,
      roundId: round1_1.id,
      amount: 50000,
      status: 'PAID',
      dueDate: new Date('2025-01-31'),
      paidAt: new Date('2025-01-30'),
      paymentMethod: 'Espèces',
      transactionId: 'ESP_003_20250130',
    },
  })

  // Paiements pour round1_2 (en cours)
  await prisma.payment.create({
    data: {
      userId: amadou.id,
      participantId: participant1_1.id,
      roundId: round1_2.id,
      amount: 50000,
      status: 'PAID',
      dueDate: new Date('2025-02-28'),
      paidAt: new Date('2025-02-15'),
      paymentMethod: 'Mobile Money',
      transactionId: 'MM_004_20250215',
    },
  })

  await prisma.payment.create({
    data: {
      userId: fatou.id,
      participantId: participant1_2.id,
      roundId: round1_2.id,
      amount: 50000,
      status: 'PAID',
      dueDate: new Date('2025-02-28'),
      paidAt: new Date('2025-02-18'),
      paymentMethod: 'Mobile Money',
      transactionId: 'MM_005_20250218',
    },
  })

  await prisma.payment.create({
    data: {
      userId: admin.id,
      participantId: participant1_3.id,
      roundId: round1_2.id,
      amount: 50000,
      status: 'PENDING',
      dueDate: new Date('2025-02-28'),
    },
  })

  // Paiements pour round2_1 (complétés)
  await prisma.payment.create({
    data: {
      userId: fatou.id,
      participantId: participant2_1.id,
      roundId: round2_1.id,
      amount: 25000,
      status: 'PAID',
      dueDate: new Date('2025-01-29'),
      paidAt: new Date('2025-01-28'),
      paymentMethod: 'Mobile Money',
      transactionId: 'MM_006_20250128',
    },
  })

  await prisma.payment.create({
    data: {
      userId: amadou.id,
      participantId: participant2_2.id,
      roundId: round2_1.id,
      amount: 25000,
      status: 'PAID',
      dueDate: new Date('2025-01-29'),
      paidAt: new Date('2025-01-29'),
      paymentMethod: 'Virement bancaire',
      transactionId: 'VB_007_20250129',
    },
  })

  // Paiements pour round2_2 (en cours)
  await prisma.payment.create({
    data: {
      userId: fatou.id,
      participantId: participant2_1.id,
      roundId: round2_2.id,
      amount: 25000,
      status: 'PAID',
      dueDate: new Date('2025-02-12'),
      paidAt: new Date('2025-02-10'),
      paymentMethod: 'Mobile Money',
      transactionId: 'MM_008_20250210',
    },
  })

  await prisma.payment.create({
    data: {
      userId: amadou.id,
      participantId: participant2_2.id,
      roundId: round2_2.id,
      amount: 25000,
      status: 'PENDING',
      dueDate: new Date('2025-02-12'),
    },
  })

  console.log('✅ Payments created')

  // 6. Créer quelques notifications
  console.log('🔔 Creating notifications...')

  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: 'PAYMENT_DUE',
      title: 'Paiement en retard',
      message: 'Votre paiement pour la Tontine Famille DIOP est dû dans 3 jours',
      priority: 'HIGH',
      tontineId: tontine1.id,
      roundId: round1_2.id,
    },
  })

  await prisma.notification.create({
    data: {
      userId: amadou.id,
      type: 'PAYMENT_RECEIVED',
      title: 'Paiement reçu',
      message: 'Votre paiement de 50 000 FCFA a été confirmé',
      priority: 'MEDIUM',
      isRead: true,
      readAt: new Date(),
      tontineId: tontine1.id,
    },
  })

  await prisma.notification.create({
    data: {
      userId: fatou.id,
      type: 'ROUND_COMPLETED',
      title: 'Tour terminé',
      message: 'Le tour 1 de la Tontine Étudiants est terminé. Vous avez reçu 50 000 FCFA',
      priority: 'HIGH',
      isRead: true,
      readAt: new Date(),
      tontineId: tontine2.id,
      roundId: round2_1.id,
    },
  })

  console.log('✅ Notifications created')

  // Statistiques finales
  const userCount = await prisma.user.count()
  const tontineCount = await prisma.tontine.count()
  const participantCount = await prisma.tontineParticipant.count()
  const roundCount = await prisma.tontineRound.count()
  const paymentCount = await prisma.payment.count()

  console.log('\n📊 Database seeded successfully!')
  console.log(`👥 Users: ${userCount} (1 admin, 2 verified, 2 unverified)`)
  console.log(`🎯 Tontines: ${tontineCount}`)
  console.log(`👨‍👩‍👧‍👦 Participants: ${participantCount}`)
  console.log(`🔄 Rounds: ${roundCount}`)
  console.log(`💳 Payments: ${paymentCount}`)
  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })