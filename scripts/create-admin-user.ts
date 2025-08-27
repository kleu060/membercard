import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'System Administrator';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating role to admin...');
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      });
      console.log('Admin user role updated successfully.');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'admin',
          subscriptionPlan: 'enterprise'
        }
      });

      console.log('Admin user created successfully:');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Name: ${adminUser.name}`);
      console.log(`Role: ${adminUser.role}`);
      console.log(`Password: ${adminPassword}`);
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser()
  .then(() => {
    console.log('Admin user creation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin user creation failed:', error);
    process.exit(1);
  });