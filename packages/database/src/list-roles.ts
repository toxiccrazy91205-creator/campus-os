import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const roles = await prisma.role.findMany();
  console.log('Roles in DB:');
  roles.forEach(r => console.log(` - ${r.name}`));
  await prisma.$disconnect();
}

main();
