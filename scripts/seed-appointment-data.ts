import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding appointment availability data...');

  try {
    // Get a sample business card (real estate template)
    const businessCard = await prisma.businessCard.findFirst({
      where: {
        template: 'real-estate'
      }
    });

    if (!businessCard) {
      console.log('No real estate business card found. Creating one...');
      
      // Get a user
      const user = await prisma.user.findFirst();
      if (!user) {
        console.log('No user found. Please create a user first.');
        return;
      }

      // Create a sample real estate business card
      const newCard = await prisma.businessCard.create({
        data: {
          userId: user.id,
          name: 'Jeremy Beadle',
          company: '事多得房屋股份有限公司',
          position: '房地產代理人',
          phone: '02-1234-5678',
          email: 'jeremy@realestate.com',
          template: 'real-estate',
          isPublic: true
        }
      });

      console.log('Created sample business card:', newCard.id);
      
      // Add availability for the new card
      await addAvailabilityForCard(newCard.id);
    } else {
      console.log('Found business card:', businessCard.id);
      await addAvailabilityForCard(businessCard.id);
    }

    console.log('Appointment availability data seeded successfully!');
  } catch (error) {
    console.error('Error seeding appointment data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function addAvailabilityForCard(cardId: string) {
  // Clear existing availability for this card
  await prisma.appointmentAvailability.deleteMany({
    where: { cardId }
  });

  // Add availability for weekdays (Monday to Friday)
  const availabilityData = [
    // Monday
    {
      cardId,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '12:00',
      maxAppointments: 2,
      bufferTime: 15
    },
    {
      cardId,
      dayOfWeek: 1, // Monday
      startTime: '14:00',
      endTime: '18:00',
      maxAppointments: 3,
      bufferTime: 15
    },
    // Tuesday
    {
      cardId,
      dayOfWeek: 2, // Tuesday
      startTime: '09:00',
      endTime: '12:00',
      maxAppointments: 2,
      bufferTime: 15
    },
    {
      cardId,
      dayOfWeek: 2, // Tuesday
      startTime: '14:00',
      endTime: '18:00',
      maxAppointments: 3,
      bufferTime: 15
    },
    // Wednesday
    {
      cardId,
      dayOfWeek: 3, // Wednesday
      startTime: '09:00',
      endTime: '12:00',
      maxAppointments: 2,
      bufferTime: 15
    },
    {
      cardId,
      dayOfWeek: 3, // Wednesday
      startTime: '14:00',
      endTime: '18:00',
      maxAppointments: 3,
      bufferTime: 15
    },
    // Thursday
    {
      cardId,
      dayOfWeek: 4, // Thursday
      startTime: '09:00',
      endTime: '12:00',
      maxAppointments: 2,
      bufferTime: 15
    },
    {
      cardId,
      dayOfWeek: 4, // Thursday
      startTime: '14:00',
      endTime: '18:00',
      maxAppointments: 3,
      bufferTime: 15
    },
    // Friday
    {
      cardId,
      dayOfWeek: 5, // Friday
      startTime: '09:00',
      endTime: '12:00',
      maxAppointments: 2,
      bufferTime: 15
    },
    {
      cardId,
      dayOfWeek: 5, // Friday
      startTime: '14:00',
      endTime: '17:00',
      maxAppointments: 2,
      bufferTime: 15
    }
  ];

  for (const availability of availabilityData) {
    await prisma.appointmentAvailability.create({
      data: availability
    });
  }

  console.log(`Added ${availabilityData.length} availability slots for card ${cardId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });