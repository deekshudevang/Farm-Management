import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.inventory.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.crop.deleteMany({});
  await prisma.field.deleteMany({});
  await prisma.user.deleteMany({});

  // ==========================================
  // 1. Create Admin Account (Primary Account)
  // ==========================================
  console.log('Creating Admin Account...');
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartfarm.com',
      password: adminPassword,
      plainPassword: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // ==========================================
  // 2. Create Old Users (Farmer Accounts)
  // ==========================================
  console.log('Creating Old User Accounts...');

  // Old user from original database
  const deekshuPassword = await bcrypt.hash('deekshu123', 10);
  const deekshu = await prisma.user.create({
    data: {
      id: '19e1eeaf-2511-41d5-8434-7d389aa99ad8',
      email: 'deekshu@farm.com',
      password: deekshuPassword,
      plainPassword: 'deekshu123',
      name: 'Deekshu',
      role: 'FARMER',
    },
  });

  console.log(`Old user restored: ${deekshu.email}`);

  // ==========================================
  // 3. Seed Admin Data — Fields
  // ==========================================
  console.log('Seeding admin fields...');
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
    prisma.field.create({
      data: {
        name: 'River Side Plot',
        size: 6.7,
        soilType: 'Sandy',
        userId: admin.id,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Hill Top Sector',
        size: 12.0,
        soilType: 'Silt',
        userId: admin.id,
      },
    }),
  ]);

  console.log('Fields created.');

  // ==========================================
  // 4. Seed Admin Data — Crops
  // ==========================================
  console.log('Seeding admin crops...');
  await Promise.all([
    prisma.crop.create({
      data: {
        name: 'Golden Wheat XL',
        variety: 'Winter Hardened',
        stage: 'Growing',
        fieldId: fields[0].id,
        plantedAt: new Date('2026-01-15'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Basmati Premium',
        variety: 'Long Grain',
        stage: 'Seedling',
        fieldId: fields[0].id,
        plantedAt: new Date('2026-03-20'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Yellow Corn',
        variety: 'High Yield',
        stage: 'Ready',
        fieldId: fields[1].id,
        plantedAt: new Date('2025-11-10'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Sugarcane',
        variety: 'Co-86032',
        stage: 'Growing',
        fieldId: fields[2].id,
        plantedAt: new Date('2026-02-01'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Cotton',
        variety: 'BT Cotton',
        stage: 'Seedling',
        fieldId: fields[2].id,
        plantedAt: new Date('2026-04-01'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Soybean',
        variety: 'JS 335',
        stage: 'Ready',
        fieldId: fields[3].id,
        plantedAt: new Date('2025-12-05'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Tomato',
        variety: 'Cherry Red',
        stage: 'Harvested',
        fieldId: fields[4].id,
        plantedAt: new Date('2025-10-15'),
      },
    }),
    prisma.crop.create({
      data: {
        name: 'Potato',
        variety: 'Kufri Jyoti',
        stage: 'Growing',
        fieldId: fields[4].id,
        plantedAt: new Date('2026-01-20'),
      },
    }),
  ]);

  console.log('Crops created.');

  // ==========================================
  // 5. Seed Admin Data — Tasks
  // ==========================================
  console.log('Seeding admin tasks...');
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Irrigate North Plot',
        description: 'Scheduled weekly irrigation cycle for wheat',
        priority: 'high',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 86400000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Apply urea fertilizer to wheat',
        description: 'Top dressing for winter wheat crop',
        priority: 'high',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 172800000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Harvest corn from South Ridge',
        description: 'Corn is ready for harvest in B-4 sector',
        priority: 'high',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 86400000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Equipment maintenance - tractor',
        description: 'Check engine oil and tire pressure',
        priority: 'medium',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 259200000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Spray pesticide on cotton crop',
        description: 'Apply BT pesticide spray on East Valley cotton',
        priority: 'high',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 86400000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare seed bed for next season',
        description: 'Plough and level field for monsoon crops',
        priority: 'low',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() - 86400000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Soil testing - East Valley',
        description: 'Collect soil samples and send to lab',
        priority: 'medium',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() - 172800000),
        userId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Order new irrigation pipes',
        description: 'Replace old drip irrigation lines in Hill Top',
        priority: 'medium',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 432000000),
        userId: admin.id,
      },
    }),
  ]);

  console.log('Tasks created.');

  // ==========================================
  // 6. Seed Admin Data — Inventory
  // ==========================================
  console.log('Seeding admin inventory...');
  await Promise.all([
    prisma.inventory.create({
      data: {
        name: 'Wheat Seeds (50kg)',
        category: 'SEED',
        quantity: 120,
        unit: 'bags',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Rice Seeds (25kg)',
        category: 'SEED',
        quantity: 45,
        unit: 'bags',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Corn Seeds (10kg)',
        category: 'SEED',
        quantity: 8,
        unit: 'bags',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Urea Fertilizer',
        category: 'FERTILIZER',
        quantity: 200,
        unit: 'kg',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'DAP Fertilizer',
        category: 'FERTILIZER',
        quantity: 75,
        unit: 'kg',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Potash',
        category: 'FERTILIZER',
        quantity: 5,
        unit: 'kg',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Pesticide Spray',
        category: 'FERTILIZER',
        quantity: 30,
        unit: 'liters',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Tractor',
        category: 'EQUIPMENT',
        quantity: 2,
        unit: 'units',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Water Pump',
        category: 'EQUIPMENT',
        quantity: 3,
        unit: 'units',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Sprinkler Set',
        category: 'EQUIPMENT',
        quantity: 6,
        unit: 'sets',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Hand Tools Set',
        category: 'EQUIPMENT',
        quantity: 15,
        unit: 'sets',
        userId: admin.id,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'Drip Irrigation Kit',
        category: 'EQUIPMENT',
        quantity: 4,
        unit: 'kits',
        userId: admin.id,
      },
    }),
  ]);

  console.log('Inventory created.');

  // ==========================================
  // Summary
  // ==========================================
  console.log('\n=========================================');
  console.log('         SEEDING COMPLETE!');
  console.log('=========================================');
  console.log('');
  console.log('ADMIN ACCOUNT (has all data):');
  console.log('  Email:    admin@smartfarm.com');
  console.log('  Password: admin123');
  console.log('  Role:     ADMIN');
  console.log('');
  console.log('OLD USER ACCOUNTS:');
  console.log('  Email:    deekshu@farm.com');
  console.log('  Password: deekshu123');
  console.log('  Role:     FARMER');
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
