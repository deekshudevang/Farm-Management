import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating Admin User...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartfarm.com',
      password: 'password123', // In a real app, hash this!
      plainPassword: 'password123',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log(`Seeding data for user: ${admin.email} (${admin.name})`);

  // 1. Create Fields (Sectors)
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: 'North Plot A-1',
        size: 15.5,
        soilType: 'Loamy',
        userId: admin.id,
      },
    }),
    prisma.field.create({
      data: {
        name: 'South Ridge B-4',
        size: 22.0,
        soilType: 'Clay',
        userId: admin.id,
      },
    }),
    prisma.field.create({
      data: {
        name: 'East Valley Terrace',
        size: 10.2,
        soilType: 'Black',
        userId: admin.id,
      },
    }),
  ]);

  console.log('Fields created.');

  // 2. Create Crops
  await Promise.all([
    prisma.crop.create({
      data: {
        name: 'Golden Wheat XL',
        variety: 'Winter Hardened',
        stage: 'Growing',
        fieldId: fields[0].id,
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Basmati Premium',
        variety: 'Long Grain',
        stage: 'Seedling',
        fieldId: fields[1].id,
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Yellow Corn',
        variety: 'High Yield',
        stage: 'Ready',
        fieldId: fields[2].id,
      },
    }),
  ]);

  console.log('Crops created.');

  // 3. Create Tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Irrigate North Sector',
        description: 'Scheduled weekly irrigation cycle',
        priority: 'high',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Soil Nutrient Analysis',
        description: 'Collect samples from Terrace',
        priority: 'medium',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 172800000), // 2 days
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Equipment Maintenance',
        description: 'Check tractor engine oil',
        priority: 'low',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        userId: admin.id,
      },
    }),
  ]);

  console.log('Tasks created.');

  // 4. Create Inventory
  await Promise.all([
    prisma.inventory.create({
      data: {
        name: 'Potassium Fertilizer',
        category: 'Fertilizer',
        quantity: 120,
        unit: 'kg',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Wheat Seeds (Premium)',
        category: 'Seeds',
        quantity: 45,
        unit: 'bags',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Diesel Fuel',
        category: 'Fuel',
        quantity: 12,
        unit: 'liters',
        userId: admin.id,
      },
    }),
  ]);

  console.log('Inventory created.');
  console.log('\n=========================================');
  console.log('SEEDING COMPLETE!');
  console.log('Login with:');
  console.log('Email: admin@smartfarm.com');
  console.log('Password: password123');
  console.log('=========================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
