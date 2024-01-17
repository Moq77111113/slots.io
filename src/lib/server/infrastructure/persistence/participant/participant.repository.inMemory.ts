import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';
import type { Participant } from '$domain/participant/models';
import type { ParticipantRepository } from '$domain/participant/spi/participant.repository';
import { randomUUID } from 'node:crypto';

export const InMemoryParticipantRepository = (): ParticipantRepository => {
	const participants: Participant[] = [];
	return {
		findOne: (id: string) => participants.find((_) => _.id === id) || null,
		findAll: ({ page = 1, limit = 10 }: ParticipantFilters) => {
			const currentPage = Math.max(1, page);
			const itemsPerPage = Math.max(1, limit);

			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;

			const paginatedParticipants = participants.slice(startIndex, endIndex);

			return {
				data: paginatedParticipants,
				total: participants.length,
				page: currentPage,
				limit: itemsPerPage
			};
		},
		create: (participant: ParticipantInput) => {
			const newParticipant = {
				...participant,
				id: randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date()
			};
			participants.push(newParticipant);
			return newParticipant;
		},
		patch: (id: string, participant: Partial<ParticipantInput>) => {
			const participantIndex = participants.findIndex((_) => _.id === id);
			if (participantIndex === -1) {
				throw Error();
			}
			const updatedParticipant = {
				...participants[participantIndex],
				...participant,
				updatedAt: new Date()
			};
			participants[participantIndex] = updatedParticipant;
			return updatedParticipant;
		},
		delete: (id: string) => {
			const participantIndex = participants.findIndex((_) => _.id === id);
			if (participantIndex === -1) {
				throw Error();
			}
			const deletedParticipant = participants[participantIndex];
			participants.splice(participantIndex, 1);
			return deletedParticipant;
		}
	};
};
