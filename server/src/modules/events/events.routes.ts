import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-source";
import { Event } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/event-participant";
import { createEventSchema, updateEventSchema } from "./events.schemas";
import { request } from "node:http";

type EventParams = { id: string }

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    const eventRepository = AppDataSource.getRepository(Event);
    const participantsRepository = AppDataSource.getRepository(EventParticipant);
    app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
        const parsedBody = createEventSchema.safeParse(request.body);

        if (!parsedBody.success) {
            return reply.code(400).send({
                message: 'Validation error',
                errors: parsedBody.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }
        const {
            title,
            description,
            capacity,
            address,
            startedAt
        } = parsedBody.data

        const event = eventRepository.create({
            title,
            description,
            capacity,
            address,
            startedAt,
            ownerId: request.user.sub
        })

        const savedEvent = await eventRepository.save(event);
        return reply.code(201).send(savedEvent);
    })

    app.get('/', { preHandler: [app.authenticate] }, async () => {
        return eventRepository.find({
            order: { startedAt: 'ASC' }
        })
    })

    app.get<{ Params: EventParams }>('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
        const event = await eventRepository.findOne({
            where: { id: request.params.id }
        })

        if (!event) {
            return reply.code(404).send({ message: 'Событие не найдено' })
        }
        return reply.send(event);
    })

    app.patch<{ Params: EventParams }>('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
        const event = await eventRepository.findOne({
            where: { id: request.params.id }
        })

        if (!event) {
            return reply.code(404).send({ message: 'Событие не найдено' })
        }

        if (event.ownerId !== request.user.sub) {
            return reply.code(403).send({
                message: "Только владелец может редактировать"
            })
        }

        const parsedBody = updateEventSchema.safeParse(request.body);
        if (!parsedBody.success) {
            return reply.code(400).send({
                message: 'Validation error',
                errors: parsedBody.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }
        const {
            title,
            description,
            capacity,
            address,
            startedAt
        } = parsedBody.data

        if (title !== undefined) {
            event.title = title
        }

        if (description !== undefined) {
            event.description = description
        }

        if (capacity !== undefined) {
            event.capacity = capacity
        }

        if (address !== undefined) {
            event.address = address
        }

        if (startedAt !== undefined) {
            event.startedAt = startedAt
        }

        const updatedEvent = await eventRepository.save(event);

        return reply.send(updatedEvent);
    })

    app.delete<{ Params: EventParams }>('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
        const event = await eventRepository.findOne({ where: { id: request.params.id } });
        if (!event) {
            return reply.code(404).send({ message: 'Событие не найдено' })
        }
        if (event.ownerId !== request.user.sub) {
            return reply.code(403).send({
                message: "Только владелец может удалить событие"
            })
        }

        await eventRepository.delete({ id: event.id });
        return reply.code(204).send()
    })

    app.post<{ Params: EventParams }>('/:id/join', { preHandler: [app.authenticate] }, async (request, reply) => {
        const event = await eventRepository.findOne({ where: { id: request.params.id } });

        if (!event) {
            return reply.code(404).send({ message: 'Событие не найдено' })
        }

        if (event.ownerId === request.user.sub) {
            return reply.code(400).send({
                message: "Нельзя присоединиться к своему событию"
            })
        }

        const existingParticipation = await participantsRepository.findOne({
            where: { eventId: event.id, userId: request.user.sub }
        })

        if (existingParticipation) {
            return reply.code(409).send({
                message: "Вы уже присоединились"
            })
        }

        const participationCount = await participantsRepository.count({
            where: { eventId: event.id }
        })

        if (participationCount >= event.capacity) {
            return reply.code(409).send({
                message: "Мест нет"
            })
        }

        const participation = participantsRepository.create({
            eventId: event.id,
            userId: request.user.sub
        })

        const savedParticipation = await participantsRepository.save(participation);

        return reply.code(201).send({
            message: "Вы присоединились к событию",
            participation: savedParticipation
        })
    })

    app.delete<{ Params: EventParams }>('/:id/join', { preHandler: [app.authenticate] }, async (request, reply) => {
        const event = await eventRepository.findOne({ where: { id: request.params.id } });

        if (!event) {
            return reply.code(404).send({ message: 'Событие не найдено' })
        }

        const existingParticipation = await participantsRepository.findOne({
            where: { eventId: event.id, userId: request.user.sub }
        })

        if (!existingParticipation) {
            return reply.code(409).send({
                message: ""
            })
        }
        await participantsRepository.delete({
            id: existingParticipation.id
        })

        return reply.code(204).send()
    })
}