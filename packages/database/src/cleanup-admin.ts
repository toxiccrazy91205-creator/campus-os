import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  console.log('Cleaning up Platform Admin...');

  // 1. Delete assignments for the admin user
  const adminUser = await prisma.platformUser.findUnique({
    where: { email: 'admin@demo.campusos.dev' }
  });

  if (adminUser) {
    await prisma.iamRoleAssignment.deleteMany({
      where: { accountId: adminUser.id }
    });
    await prisma.iamEffectiveAccessCache.deleteMany({
      where: { accountId: adminUser.id }
    });
    await prisma.platformUser.delete({
      where: { id: adminUser.id }
    });
    console.log('  Deleted platform user: admin@demo.campusos.dev');
  }

  // 2. Delete the Platform Admin role
  const adminRole = await prisma.role.findFirst({
    where: { name: 'Platform Admin' }
  });

  if (adminRole) {
    await prisma.rolePermission.deleteMany({
      where: { roleId: adminRole.id }
    });
    await prisma.iamRoleAssignment.deleteMany({
      where: { roleId: adminRole.id }
    });
    await prisma.role.delete({
      where: { id: adminRole.id }
    });
    console.log('  Deleted role: Platform Admin');
  }

  await prisma.$disconnect();
  console.log('Cleanup complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
