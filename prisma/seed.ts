import { PrismaClient } from '../lib/generated/prisma'
import { auth } from '../lib/auth'
import { generateInviteCode } from '../lib/utils/invite-code'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Nettoyer toutes les données existantes
  console.log('🧹 Cleaning existing data...')

  try {
    // Supprimer dans l'ordre inverse des dépendances
    await prisma.notification.deleteMany({})
    await prisma.payment.deleteMany({})
    await prisma.tontineRound.deleteMany({})
    await prisma.tontineParticipant.deleteMany({})
    await prisma.tontineInvitation.deleteMany({})
    await prisma.tontine.deleteMany({})
    await prisma.identityVerification.deleteMany({})
    await prisma.userProfile.deleteMany({})
    await prisma.auditLog.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.verification.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('✅ Database cleaned')
  } catch (e) {
    console.error('Error cleaning database:', e)
  }

  // Helper function to create better-auth compatible users
  const createUser = async (userData: any) => {
    console.log(`Creating user: ${userData.email}`)

    try {

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
            submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours avant
            reviewedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 jours avant
            approvedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
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

      console.log(`✅ User created: ${user.email} (${userData.role || 'USER'})`)
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

  // EDUZVS

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

  const moussa = await createUser({
    name: 'Moussa SECK',
    email: 'moussa.seck@email.com',
    password: 'moussa123456',
    firstName: 'Moussa',
    lastName: 'SECK',
    telephone: '+221 78 321 98 76',
    address: 'Sacré-Cœur, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    emailVerified: true,
    gender: 'M',
    dateOfBirth: new Date('1988-09-10'),
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
  if (!admin || !amadou || !fatou || !moussa || !oumar || !awa) {
    console.error('❌ Some users failed to create, aborting seed')
    return
  }

  // ===================================================================
  // 2. TONTINE CLÔTURÉE - Été 2025 (COMPLETED)
  // ===================================================================
  console.log('🎯 Creating completed tontine (Été 2025)...')

  const tontineEte = await prisma.tontine.create({
    data: {
      name: 'Tontine Été 2025',
      description: 'Épargne pour les vacances d\'été - Terminée avec succès',
      amountPerRound: 75000, // 75 000 FCFA par tour
      totalAmountPerRound: 300000, // 4 participants × 75 000
      frequencyType: 'MONTHLY',
      frequencyValue: 1,
      status: 'COMPLETED',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-09-01'),
      maxParticipants: 4,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      inviteCode: generateInviteCode(),
      creatorId: amadou.id,
    },
  })
  console.log(`   📋 Code d'invitation: ${tontineEte.inviteCode}`)

  // Participants tontine été
  const partEte1 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontineEte.id,
      sharesCount: 1,
      totalCommitted: 300000, // 4 tours × 75 000
      isActive: true,
      joinedAt: new Date('2025-05-20'),
    },
  })

  const partEte2 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontineEte.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-05-22'),
    },
  })

  const partEte3 = await prisma.tontineParticipant.create({
    data: {
      userId: moussa.id,
      tontineId: tontineEte.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-05-25'),
    },
  })

  const partEte4 = await prisma.tontineParticipant.create({
    data: {
      userId: admin.id,
      tontineId: tontineEte.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-05-28'),
    },
  })

  // Rounds et paiements - Tontine été (tous complétés)
  const roundEte1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEte.id,
      roundNumber: 1,
      expectedAmount: 300000,
      collectedAmount: 300000,
      distributedAmount: 300000,
      dueDate: new Date('2025-06-30'),
      collectionStartDate: new Date('2025-06-01'),
      completedAt: new Date('2025-06-30'),
      status: 'COMPLETED',
      winnerId: partEte1.id, // Amadou
    },
  })

  // Paiements round 1 été
  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partEte1.id,
        roundId: roundEte1.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-06-30'),
        paidAt: new Date('2025-06-15'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETE_001',
      },
      {
        userId: fatou.id,
        participantId: partEte2.id,
        roundId: roundEte1.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-06-30'),
        paidAt: new Date('2025-06-18'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETE_002',
      },
      {
        userId: moussa.id,
        participantId: partEte3.id,
        roundId: roundEte1.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-06-30'),
        paidAt: new Date('2025-06-20'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM_ETE_003',
      },
      {
        userId: admin.id,
        participantId: partEte4.id,
        roundId: roundEte1.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-06-30'),
        paidAt: new Date('2025-06-28'),
        paymentMethod: 'Virement',
        transactionId: 'VB_ETE_004',
      },
    ],
  })

  const roundEte2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEte.id,
      roundNumber: 2,
      expectedAmount: 300000,
      collectedAmount: 300000,
      distributedAmount: 300000,
      dueDate: new Date('2025-07-31'),
      collectionStartDate: new Date('2025-07-01'),
      completedAt: new Date('2025-07-31'),
      status: 'COMPLETED',
      winnerId: partEte2.id, // Fatou
    },
  })

  // Paiements round 2 été
  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partEte1.id,
        roundId: roundEte2.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-07-31'),
        paidAt: new Date('2025-07-10'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETE_005',
      },
      {
        userId: fatou.id,
        participantId: partEte2.id,
        roundId: roundEte2.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-07-31'),
        paidAt: new Date('2025-07-15'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETE_006',
      },
      {
        userId: moussa.id,
        participantId: partEte3.id,
        roundId: roundEte2.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-07-31'),
        paidAt: new Date('2025-07-20'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM_ETE_007',
      },
      {
        userId: admin.id,
        participantId: partEte4.id,
        roundId: roundEte2.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-07-31'),
        paidAt: new Date('2025-07-29'),
        paymentMethod: 'Espèces',
        transactionId: 'ESP_ETE_008',
      },
    ],
  })

  const roundEte3 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEte.id,
      roundNumber: 3,
      expectedAmount: 300000,
      collectedAmount: 300000,
      distributedAmount: 300000,
      dueDate: new Date('2025-08-31'),
      collectionStartDate: new Date('2025-08-01'),
      completedAt: new Date('2025-08-31'),
      status: 'COMPLETED',
      winnerId: partEte3.id, // Moussa
    },
  })

  // Paiements round 3 été
  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partEte1.id,
        roundId: roundEte3.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-08-31'),
        paidAt: new Date('2025-08-05'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETE_009',
      },
      {
        userId: fatou.id,
        participantId: partEte2.id,
        roundId: roundEte3.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-08-31'),
        paidAt: new Date('2025-08-10'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETE_010',
      },
      {
        userId: moussa.id,
        participantId: partEte3.id,
        roundId: roundEte3.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-08-31'),
        paidAt: new Date('2025-08-15'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM_ETE_011',
      },
      {
        userId: admin.id,
        participantId: partEte4.id,
        roundId: roundEte3.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-08-31'),
        paidAt: new Date('2025-08-28'),
        paymentMethod: 'Virement',
        transactionId: 'VB_ETE_012',
      },
    ],
  })

  const roundEte4 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEte.id,
      roundNumber: 4,
      expectedAmount: 300000,
      collectedAmount: 300000,
      distributedAmount: 300000,
      dueDate: new Date('2025-09-30'),
      collectionStartDate: new Date('2025-09-01'),
      completedAt: new Date('2025-09-30'),
      status: 'COMPLETED',
      winnerId: partEte4.id, // Admin
    },
  })

  // Paiements round 4 été
  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partEte1.id,
        roundId: roundEte4.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-05'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETE_013',
      },
      {
        userId: fatou.id,
        participantId: partEte2.id,
        roundId: roundEte4.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-10'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETE_014',
      },
      {
        userId: moussa.id,
        participantId: partEte3.id,
        roundId: roundEte4.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-15'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM_ETE_015',
      },
      {
        userId: admin.id,
        participantId: partEte4.id,
        roundId: roundEte4.id,
        amount: 75000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-28'),
        paymentMethod: 'Espèces',
        transactionId: 'ESP_ETE_016',
      },
    ],
  })

  console.log('✅ Tontine été (clôturée) created')

  // ===================================================================
  // 3. TONTINE EN COURS 1 - Famille DIOP (ACTIVE - presque terminée)
  // ===================================================================
  console.log('🎯 Creating active tontine 1 (Famille DIOP)...')

  const tontineFamille = await prisma.tontine.create({
    data: {
      name: 'Tontine Famille DIOP',
      description: 'Épargne familiale mensuelle pour projets communs',
      amountPerRound: 100000, // 100 000 FCFA par tour
      totalAmountPerRound: 300000, // 3 participants × 100 000
      frequencyType: 'MONTHLY',
      frequencyValue: 1,
      status: 'ACTIVE',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-11-30'),
      maxParticipants: 3,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      inviteCode: generateInviteCode(),
      creatorId: amadou.id,
    },
  })
  console.log(`   📋 Code d'invitation: ${tontineFamille.inviteCode}`)

  // Participants
  const partFam1 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontineFamille.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-08-25'),
    },
  })

  const partFam2 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontineFamille.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-08-26'),
    },
  })

  const partFam3 = await prisma.tontineParticipant.create({
    data: {
      userId: admin.id,
      tontineId: tontineFamille.id,
      sharesCount: 1,
      totalCommitted: 300000,
      isActive: true,
      joinedAt: new Date('2025-08-27'),
    },
  })

  // Round 1 - Complété (Septembre)
  const roundFam1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFamille.id,
      roundNumber: 1,
      expectedAmount: 300000,
      collectedAmount: 300000,
      distributedAmount: 300000,
      dueDate: new Date('2025-09-30'),
      collectionStartDate: new Date('2025-09-01'),
      completedAt: new Date('2025-09-30'),
      status: 'COMPLETED',
      winnerId: partFam1.id, // Amadou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partFam1.id,
        roundId: roundFam1.id,
        amount: 100000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-10'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_FAM_001',
      },
      {
        userId: fatou.id,
        participantId: partFam2.id,
        roundId: roundFam1.id,
        amount: 100000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-15'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_FAM_002',
      },
      {
        userId: admin.id,
        participantId: partFam3.id,
        roundId: roundFam1.id,
        amount: 100000,
        status: 'PAID',
        dueDate: new Date('2025-09-30'),
        paidAt: new Date('2025-09-28'),
        paymentMethod: 'Virement',
        transactionId: 'VB_FAM_003',
      },
    ],
  })

  // Round 2 - En collecte (Octobre - en cours)
  const roundFam2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFamille.id,
      roundNumber: 2,
      expectedAmount: 300000,
      collectedAmount: 200000, // 2 sur 3 ont payé
      distributedAmount: 0,
      dueDate: new Date('2025-10-31'),
      collectionStartDate: new Date('2025-10-01'),
      status: 'COLLECTING',
      winnerId: partFam2.id, // Fatou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partFam1.id,
        roundId: roundFam2.id,
        amount: 100000,
        status: 'PAID',
        dueDate: new Date('2025-10-31'),
        paidAt: new Date('2025-10-08'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_FAM_004',
      },
      {
        userId: fatou.id,
        participantId: partFam2.id,
        roundId: roundFam2.id,
        amount: 100000,
        status: 'PAID',
        dueDate: new Date('2025-10-31'),
        paidAt: new Date('2025-10-12'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_FAM_005',
      },
      {
        userId: admin.id,
        participantId: partFam3.id,
        roundId: roundFam2.id,
        amount: 100000,
        status: 'PENDING',
        dueDate: new Date('2025-10-31'),
      },
    ],
  })

  // Round 3 - Pending (Novembre)
  const roundFam3 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFamille.id,
      roundNumber: 3,
      expectedAmount: 300000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-11-30'),
      collectionStartDate: new Date('2025-11-01'),
      status: 'PENDING',
      winnerId: partFam3.id, // Admin
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: amadou.id,
        participantId: partFam1.id,
        roundId: roundFam3.id,
        amount: 100000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
      {
        userId: fatou.id,
        participantId: partFam2.id,
        roundId: roundFam3.id,
        amount: 100000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
      {
        userId: admin.id,
        participantId: partFam3.id,
        roundId: roundFam3.id,
        amount: 100000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
    ],
  })

  console.log('✅ Tontine Famille (en cours) created')

  // ===================================================================
  // 4. TONTINE EN COURS 2 - Étudiants (ACTIVE - début récent)
  // ===================================================================
  console.log('🎯 Creating active tontine 2 (Étudiants)...')

  const tontineEtudiants = await prisma.tontine.create({
    data: {
      name: 'Tontine Étudiants Automne',
      description: 'Épargne entre amis pour financer le matériel scolaire',
      amountPerRound: 40000, // 40 000 FCFA par tour
      totalAmountPerRound: 160000, // 4 participants × 40 000
      frequencyType: 'WEEKLY',
      frequencyValue: 2, // Toutes les 2 semaines
      status: 'ACTIVE',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-15'),
      maxParticipants: 4,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      inviteCode: generateInviteCode(),
      creatorId: fatou.id,
    },
  })
  console.log(`   📋 Code d'invitation: ${tontineEtudiants.inviteCode}`)

  // Participants
  const partEtu1 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontineEtudiants.id,
      sharesCount: 1,
      totalCommitted: 160000, // 4 tours × 40 000
      isActive: true,
      joinedAt: new Date('2025-09-25'),
    },
  })

  const partEtu2 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontineEtudiants.id,
      sharesCount: 1,
      totalCommitted: 160000,
      isActive: true,
      joinedAt: new Date('2025-09-26'),
    },
  })

  const partEtu3 = await prisma.tontineParticipant.create({
    data: {
      userId: moussa.id,
      tontineId: tontineEtudiants.id,
      sharesCount: 1,
      totalCommitted: 160000,
      isActive: true,
      joinedAt: new Date('2025-09-27'),
    },
  })

  const partEtu4 = await prisma.tontineParticipant.create({
    data: {
      userId: admin.id,
      tontineId: tontineEtudiants.id,
      sharesCount: 1,
      totalCommitted: 160000,
      isActive: true,
      joinedAt: new Date('2025-09-28'),
    },
  })

  // Round 1 - Complété (1-15 octobre)
  const roundEtu1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEtudiants.id,
      roundNumber: 1,
      expectedAmount: 160000,
      collectedAmount: 160000,
      distributedAmount: 160000,
      dueDate: new Date('2025-10-15'),
      collectionStartDate: new Date('2025-10-01'),
      completedAt: new Date('2025-10-15'),
      status: 'COMPLETED',
      winnerId: partEtu1.id, // Fatou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: fatou.id,
        participantId: partEtu1.id,
        roundId: roundEtu1.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-15'),
        paidAt: new Date('2025-10-05'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETU_001',
      },
      {
        userId: amadou.id,
        participantId: partEtu2.id,
        roundId: roundEtu1.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-15'),
        paidAt: new Date('2025-10-08'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETU_002',
      },
      {
        userId: moussa.id,
        participantId: partEtu3.id,
        roundId: roundEtu1.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-15'),
        paidAt: new Date('2025-10-10'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM_ETU_003',
      },
      {
        userId: admin.id,
        participantId: partEtu4.id,
        roundId: roundEtu1.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-15'),
        paidAt: new Date('2025-10-14'),
        paymentMethod: 'Virement',
        transactionId: 'VB_ETU_004',
      },
    ],
  })

  // Round 2 - En collecte (16-29 octobre - proche de la date du jour)
  const roundEtu2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEtudiants.id,
      roundNumber: 2,
      expectedAmount: 160000,
      collectedAmount: 80000, // 2 sur 4 ont payé
      distributedAmount: 0,
      dueDate: new Date('2025-10-29'),
      collectionStartDate: new Date('2025-10-16'),
      status: 'COLLECTING',
      winnerId: partEtu2.id, // Amadou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: fatou.id,
        participantId: partEtu1.id,
        roundId: roundEtu2.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-29'),
        paidAt: new Date('2025-10-18'),
        paymentMethod: 'Wave',
        transactionId: 'WAVE_ETU_005',
      },
      {
        userId: amadou.id,
        participantId: partEtu2.id,
        roundId: roundEtu2.id,
        amount: 40000,
        status: 'PAID',
        dueDate: new Date('2025-10-29'),
        paidAt: new Date('2025-10-20'),
        paymentMethod: 'Mobile Money',
        transactionId: 'MM_ETU_006',
      },
      {
        userId: moussa.id,
        participantId: partEtu3.id,
        roundId: roundEtu2.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-10-29'),
      },
      {
        userId: admin.id,
        participantId: partEtu4.id,
        roundId: roundEtu2.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-10-29'),
      },
    ],
  })

  // Round 3 - Pending (30 octobre - 12 novembre)
  const roundEtu3 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEtudiants.id,
      roundNumber: 3,
      expectedAmount: 160000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-11-12'),
      collectionStartDate: new Date('2025-10-30'),
      status: 'PENDING',
      winnerId: partEtu3.id, // Moussa
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: fatou.id,
        participantId: partEtu1.id,
        roundId: roundEtu3.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-12'),
      },
      {
        userId: amadou.id,
        participantId: partEtu2.id,
        roundId: roundEtu3.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-12'),
      },
      {
        userId: moussa.id,
        participantId: partEtu3.id,
        roundId: roundEtu3.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-12'),
      },
      {
        userId: admin.id,
        participantId: partEtu4.id,
        roundId: roundEtu3.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-12'),
      },
    ],
  })

  // Round 4 - Pending (13 novembre - 26 novembre)
  const roundEtu4 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineEtudiants.id,
      roundNumber: 4,
      expectedAmount: 160000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-11-26'),
      collectionStartDate: new Date('2025-11-13'),
      status: 'PENDING',
      winnerId: partEtu4.id, // Admin
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: fatou.id,
        participantId: partEtu1.id,
        roundId: roundEtu4.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-26'),
      },
      {
        userId: amadou.id,
        participantId: partEtu2.id,
        roundId: roundEtu4.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-26'),
      },
      {
        userId: moussa.id,
        participantId: partEtu3.id,
        roundId: roundEtu4.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-26'),
      },
      {
        userId: admin.id,
        participantId: partEtu4.id,
        roundId: roundEtu4.id,
        amount: 40000,
        status: 'PENDING',
        dueDate: new Date('2025-11-26'),
      },
    ],
  })

  console.log('✅ Tontine Étudiants (en cours) created')

  // ===================================================================
  // 5. TONTINE À VENIR - Fin d'année (DRAFT)
  // ===================================================================
  console.log('🎯 Creating upcoming tontine (Fin d\'année)...')

  const tontineFinAnnee = await prisma.tontine.create({
    data: {
      name: 'Tontine Fin d\'Année 2025',
      description: 'Épargne pour les fêtes de fin d\'année et projets 2026',
      amountPerRound: 150000, // 150 000 FCFA par tour
      totalAmountPerRound: 450000, // 3 participants × 150 000
      frequencyType: 'MONTHLY',
      frequencyValue: 1,
      status: 'DRAFT',
      startDate: new Date('2025-11-15'),
      endDate: new Date('2026-01-31'),
      maxParticipants: 3,
      allowMultipleShares: false,
      maxSharesPerUser: 1,
      inviteCode: generateInviteCode(),
      creatorId: moussa.id,
    },
  })
  console.log(`   📋 Code d'invitation: ${tontineFinAnnee.inviteCode}`)

  // Participants (déjà inscrits mais tontine pas encore démarrée)
  const partFin1 = await prisma.tontineParticipant.create({
    data: {
      userId: moussa.id,
      tontineId: tontineFinAnnee.id,
      sharesCount: 1,
      totalCommitted: 450000, // 3 tours × 150 000
      isActive: true,
      joinedAt: new Date('2025-10-10'),
    },
  })

  const partFin2 = await prisma.tontineParticipant.create({
    data: {
      userId: amadou.id,
      tontineId: tontineFinAnnee.id,
      sharesCount: 1,
      totalCommitted: 450000,
      isActive: true,
      joinedAt: new Date('2025-10-12'),
    },
  })

  const partFin3 = await prisma.tontineParticipant.create({
    data: {
      userId: fatou.id,
      tontineId: tontineFinAnnee.id,
      sharesCount: 1,
      totalCommitted: 450000,
      isActive: true,
      joinedAt: new Date('2025-10-15'),
    },
  })

  // Rounds créés mais en attente de démarrage
  const roundFin1 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFinAnnee.id,
      roundNumber: 1,
      expectedAmount: 450000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-11-30'),
      collectionStartDate: new Date('2025-11-15'),
      status: 'PENDING',
      winnerId: partFin1.id, // Moussa
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: moussa.id,
        participantId: partFin1.id,
        roundId: roundFin1.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
      {
        userId: amadou.id,
        participantId: partFin2.id,
        roundId: roundFin1.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
      {
        userId: fatou.id,
        participantId: partFin3.id,
        roundId: roundFin1.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-11-30'),
      },
    ],
  })

  const roundFin2 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFinAnnee.id,
      roundNumber: 2,
      expectedAmount: 450000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2025-12-31'),
      collectionStartDate: new Date('2025-12-01'),
      status: 'PENDING',
      winnerId: partFin2.id, // Amadou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: moussa.id,
        participantId: partFin1.id,
        roundId: roundFin2.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-12-31'),
      },
      {
        userId: amadou.id,
        participantId: partFin2.id,
        roundId: roundFin2.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-12-31'),
      },
      {
        userId: fatou.id,
        participantId: partFin3.id,
        roundId: roundFin2.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2025-12-31'),
      },
    ],
  })

  const roundFin3 = await prisma.tontineRound.create({
    data: {
      tontineId: tontineFinAnnee.id,
      roundNumber: 3,
      expectedAmount: 450000,
      collectedAmount: 0,
      distributedAmount: 0,
      dueDate: new Date('2026-01-31'),
      collectionStartDate: new Date('2026-01-01'),
      status: 'PENDING',
      winnerId: partFin3.id, // Fatou
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        userId: moussa.id,
        participantId: partFin1.id,
        roundId: roundFin3.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2026-01-31'),
      },
      {
        userId: amadou.id,
        participantId: partFin2.id,
        roundId: roundFin3.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2026-01-31'),
      },
      {
        userId: fatou.id,
        participantId: partFin3.id,
        roundId: roundFin3.id,
        amount: 150000,
        status: 'PENDING',
        dueDate: new Date('2026-01-31'),
      },
    ],
  })

  console.log('✅ Tontine Fin d\'année (à venir) created')

  // ===================================================================
  // 6. Créer quelques notifications réalistes
  // ===================================================================
  console.log('🔔 Creating notifications...')

  await prisma.notification.createMany({
    data: [
      // Notification paiement en retard (Tontine Famille - Admin)
      {
        userId: admin.id,
        type: 'PAYMENT_DUE',
        title: 'Paiement en retard',
        message: 'Votre paiement pour la Tontine Famille DIOP est dû le 31 octobre (dans 9 jours)',
        priority: 'HIGH',
        tontineId: tontineFamille.id,
        roundId: roundFam2.id,
      },
      // Notification paiement proche (Tontine Étudiants - Moussa)
      {
        userId: moussa.id,
        type: 'PAYMENT_DUE',
        title: 'Paiement imminent',
        message: 'N\'oubliez pas votre paiement pour la Tontine Étudiants (29 octobre - dans 7 jours)',
        priority: 'MEDIUM',
        tontineId: tontineEtudiants.id,
        roundId: roundEtu2.id,
      },
      // Notification round complété (Fatou)
      {
        userId: fatou.id,
        type: 'ROUND_COMPLETED',
        title: 'Tour terminé',
        message: 'Le tour 1 de la Tontine Étudiants est terminé. Vous avez reçu 160 000 FCFA',
        priority: 'HIGH',
        isRead: true,
        readAt: new Date('2025-10-16'),
        tontineId: tontineEtudiants.id,
        roundId: roundEtu1.id,
      },
      // Notification paiement reçu (Amadou)
      {
        userId: amadou.id,
        type: 'PAYMENT_RECEIVED',
        title: 'Paiement confirmé',
        message: 'Votre paiement de 100 000 FCFA pour la Tontine Famille a été reçu',
        priority: 'MEDIUM',
        isRead: true,
        readAt: new Date('2025-10-09'),
        tontineId: tontineFamille.id,
      },
      // Notification tontine à venir (Moussa)
      {
        userId: moussa.id,
        type: 'TONTINE_STARTED',
        title: 'Tontine prête à démarrer',
        message: 'La Tontine Fin d\'Année démarrera le 15 novembre. Préparez votre première cotisation !',
        priority: 'MEDIUM',
        tontineId: tontineFinAnnee.id,
      },
      // Notification identité vérifiée (Fatou)
      {
        userId: fatou.id,
        type: 'IDENTITY_VERIFIED',
        title: 'Identité vérifiée',
        message: 'Votre identité a été vérifiée avec succès. Vous pouvez maintenant participer à toutes les tontines.',
        priority: 'HIGH',
        isRead: true,
        readAt: new Date('2025-09-24'),
      },
    ],
  })

  console.log('✅ Notifications created')

  // Statistiques finales
  const userCount = await prisma.user.count()
  const tontineCount = await prisma.tontine.count()
  const participantCount = await prisma.tontineParticipant.count()
  const roundCount = await prisma.tontineRound.count()
  const paymentCount = await prisma.payment.count()

  console.log('\n📊 Database seeded successfully!')
  console.log(`👥 Users: ${userCount} (1 admin, 3 verified, 2 unverified)`)
  console.log(`🎯 Tontines: ${tontineCount}`)
  console.log(`   ✅ Clôturée: 1 (Été 2025)`)
  console.log(`   🔄 En cours: 2 (Famille DIOP, Étudiants)`)
  console.log(`   📅 À venir: 1 (Fin d'Année)`)
  console.log(`👨‍👩‍👧‍👦 Participants: ${participantCount}`)
  console.log(`🔄 Rounds: ${roundCount}`)
  console.log(`💳 Payments: ${paymentCount}`)
  console.log('\n🎉 Seeding completed with realistic and coherent data!')
  console.log('\n📅 Reference date: October 22, 2025')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
