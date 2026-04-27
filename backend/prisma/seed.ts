import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartfarm.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@smartfarm.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      plainPassword: 'admin123',
    },
  })

  // Seed old user: deekshu
  const deekshuPassword = await bcrypt.hash('deekshu123', 10)
  
  const deekshu = await prisma.user.upsert({
    where: { email: 'deekshu@farm.com' },
    update: {
      password: deekshuPassword,
      role: 'FARMER',
    },
    create: {
      id: '19e1eeaf-2511-41d5-8434-7d389aa99ad8',
      email: 'deekshu@farm.com',
      password: deekshuPassword,
      name: 'Deekshu',
      role: 'FARMER',
      plainPassword: 'deekshu123',
    },
  })

  console.log('Seeded users:', { admin: admin.email, deekshu: deekshu.email })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
