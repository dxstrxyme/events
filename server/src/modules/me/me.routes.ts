import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-source";
import { EventParticipant } from "../../db/entities/event-participant";

export const meRoutes: FastifyPluginAsync = async (app) => {
    const participantsRepository = AppDataSource.getRepository(EventParticipant);

    app.get('/events/joined', { preHandler: [app.authenticate] }, async (request, reply) => {
        const participations = await participantsRepository.find({
            where: { userId: request.user.sub },
            relations: {
                event: true
            },
            order: {
                joinedAt: 'DESC'
            }
        })

        return participations.map(participation => ({
            joinedAt: participation.joinedAt,
            event: participation.event
        }))
    })
}

