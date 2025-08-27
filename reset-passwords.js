const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPasswords() {
  try {
    // Hash the new password
    const newPassword = 'newtest123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the test accounts
    const testAccounts = [
      { email: 'professional1@test.com', name: 'Professional User 1' },
      { email: 'professional2@test.com', name: 'Professional User 2' },
      { email: 'professional3@test.com', name: 'Professional User 3' }
    ];

    for (const account of testAccounts) {
      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: account.email }
      });

      if (user) {
        // Update existing user
        await prisma.user.update({
          where: { email: account.email },
          data: { 
            password: hashedPassword,
            name: account.name,
            subscriptionPlan: 'professional'
          }
        });
        console.log(`Updated password for ${account.email}`);
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            email: account.email,
            password: hashedPassword,
            name: account.name,
            subscriptionPlan: 'professional'
          }
        });
        console.log(`Created new user ${account.email}`);
      }
    }

    console.log('Password reset completed successfully!');
    console.log('New password for all test accounts: newtest123');

  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPasswords();