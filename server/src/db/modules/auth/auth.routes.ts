import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { registerSchema } from "./auth.schemas";
import argon2 from "argon2";

export const authRoutes: FastifyPluginAsync = async (app) => {
    const userRepository = AppDataSource.getRepository(User)

    app.post('/register', async (request, reply) => {
        const parseBody = registerSchema.safeParse(request.body);
        if (!parseBody.success) {
            return reply.code(400).send({
                message: 'Validation error',
                errors: parseBody.error
            })
        }
        const { email, password, name } = parseBody.data;
        const existingUser = await userRepository.find({ where: { email } });
        if (existingUser) {
            return reply.code(409).send({ message: 'Пользователь с таким email уже есть' })
        }

        const passwordHash = await argon2.hash(password);
        const user = userRepository.create({
            email,
            passwordHash,
            name
        });

        const savedUser = await userRepository.save(user);
        const token = await reply.jwtSign({ sub: savedUser.id, email: savedUser.email });
        return reply.code(201).send({
            token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                name: savedUser.name
            }
        })
    })
}