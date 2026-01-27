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

  // 4. Get all statuses
  const [toBeReviewedStatus, reviewSubmittedStatus, observationStatus, completeStatus] =
    await Promise.all([
      prisma.caseStatus.findUnique({ where: { name: 'TO_BE_REVIEWED' } }),
      prisma.caseStatus.findUnique({ where: { name: 'REVIEW_SUBMITTED' } }),
      prisma.caseStatus.findUnique({ where: { name: 'OBSERVATION' } }),
      prisma.caseStatus.findUnique({ where: { name: 'COMPLETE' } }),
    ]);

  if (!toBeReviewedStatus || !reviewSubmittedStatus || !observationStatus || !completeStatus) {
    throw new Error('Failed to create case statuses');
  }

  // 5. Create 35 Cases
  const assigners = [john.id, bob.id];

  // template data
  const templates = [
    ['Customer Data Privacy Concern', 'Customer reported unauthorized access to their account'],
    ['Payment Processing Error', 'Multiple users reported failed transactions'],
    ['System Performance Degradation', 'Slow response times reported during peak hours'],
    ['Email Delivery Issues', 'Confirmation emails not being received by customers'],
    ['Mobile App Crash Reports', 'iOS app crashing on startup for some users'],
    ['Inventory Discrepancy Alert', 'Mismatch between system and warehouse stock'],
    ['API Rate Limiting Investigation', 'Third-party integration timing out frequently'],
    ['Customer Refund Request', 'Large order cancellation requires approval'],
    ['Security Vulnerability Report', 'Potential SQL injection reported'],
    ['Data Migration Validation', 'Verify integrity of migrated records'],
  ];

  const statusBuckets = [
    { status: toBeReviewedStatus.id, count: 10 },
    { status: reviewSubmittedStatus.id, count: 8 },
    { status: observationStatus.id, count: 9 },
    { status: completeStatus.id, count: 8 },
  ];

  const users = [john, bob, sam];

  const casesData: any[] = [];
  let templateIndex = 0;

  for (const bucket of statusBuckets) {
    for (let i = 0; i < bucket.count; i++) {
      const [title, description] = templates[templateIndex % templates.length];

      const creator = users[Math.floor(Math.random() * users.length)];
      const assignee = users[Math.floor(Math.random() * users.length)];
      const assigner = assigners[Math.floor(Math.random() * assigners.length)];

      casesData.push({
        title: `${title} #${casesData.length + 1}`,
        description,
        createdBy: creator.id,
        assignedTo: assignee.id,
        assignedBy: assigner,
        statusId: bucket.status,
      });

      templateIndex++;
    }
  }

  // insert
  await prisma.case.createMany({
    data: casesData,
  });

  console.log(`✅ ${casesData.length} cases created`);


  // Insert all cases
  for (const caseData of casesData) {
    await prisma.case.create({ data: caseData });
  }

  console.log('Seed completed');
  console.log(`
✅ Roles created: ADMIN, SUPERVISOR, AGENT
✅ Statuses created: TO_BE_REVIEWED, REVIEW_SUBMITTED, OBSERVATION, COMPLETE
✅ Users created:
   - John (ADMIN): ${john.id}
   - Bob (SUPERVISOR): ${bob.id}
   - Sam (AGENT): ${sam.id}
✅ Cases created: 35 cases
   - TO_BE_REVIEWED: 10 cases
   - REVIEW_SUBMITTED: 8 cases
   - OBSERVATION: 9 cases
   - COMPLETE: 8 cases
`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });