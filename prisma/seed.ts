import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Roles
  const [adminRole, supervisorRole, agentRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' },
    }),
    prisma.role.upsert({
      where: { name: 'SUPERVISOR' },
      update: {},
      create: { name: 'SUPERVISOR' },
    }),
    prisma.role.upsert({
      where: { name: 'AGENT' },
      update: {},
      create: { name: 'AGENT' },
    }),
  ]);

  // 2. Case Statuses
  const statuses = [
    'TO_BE_REVIEWED',
    'REVIEW_SUBMITTED',
    'OBSERVATION',
    'COMPLETE',
  ];

  for (const status of statuses) {
    await prisma.caseStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }

  // 3. Users
  const john = await prisma.user.upsert({
    where: { id: '11111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'John',
      roleId: adminRole.id,
    },
  });

  const bob = await prisma.user.upsert({
    where: { id: '22222222-2222-4222-8222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Bob',
      roleId: supervisorRole.id,
    },
  });

  const sam = await prisma.user.upsert({
    where: { id: '33333333-3333-4333-8333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Sam',
      roleId: agentRole.id,
    },
  });

  // 4. Example Case (optional)
  const toBeReviewedStatus = await prisma.caseStatus.findUnique({
    where: { name: 'TO_BE_REVIEWED' },
  });

  if (toBeReviewedStatus) {
    await prisma.case.create({
      data: {
        title: 'Initial Case Example',
        description: 'Sample case created by John and assigned to Bob',
        createdBy: john.id,
        assignedTo: bob.id,
        statusId: toBeReviewedStatus.id,
      },
    });
  }

  console.log('Seed completed');
  console.log(`
 Users created:
- John (ADMIN): ${john.id}
- Bob (SUPERVISOR): ${bob.id}
- Sam (AGENT): ${sam.id}
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
