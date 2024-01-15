import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
try {
	console.log('Seeding database...');
	// Seed Participants
	const participant1 = await prisma.participant.create({
		data: {
			name: 'John Doe'
		}
	});

	const participant2 = await prisma.participant.create({
		data: {
			name: 'Alice Smith'
		}
	});

	// Seed Events
	const event1 = await prisma.event.create({
		data: {
			title: 'Team Meeting',
			date: new Date(),
			location: 'Conference Room',
			organizerId: participant1.id,
			participants: {
				connect: [{ id: participant1.id }, { id: participant2.id }]
			}
		}
	});

	const event2 = await prisma.event.create({
		data: {
			title: 'Project Kickoff',
			date: new Date(),
			location: 'Zoom Meeting',
			organizerId: participant2.id,
			participants: {
				connect: [{ id: participant1.id }, { id: participant2.id }]
			}
		}
	});

	// Seed Votes
	await prisma.vote.create({
		data: {
			participantId: participant1.id,
			eventId: event2.id,
			content: { choice: 'Option A' }
		}
	});

	await prisma.vote.create({
		data: {
			participantId: participant2.id,
			eventId: event1.id,
			content: { choice: 'Option B' }
		}
	});

	console.log('Seed completed successfully');
} catch (e) {
	console.error(e);
} finally {
	await prisma.$disconnect();
}
