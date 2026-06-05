import { DataSource } from "typeorm";
import { env } from "../../config/env";
import { User } from "./entities/user.entity";
import { Event } from "./entities/event.entity";
import { EventParticipant } from "./entities/event-participant";

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: env.databaseUrl,
    synchronize: false,
    logging: true,
    entities: [User, Event, EventParticipant],
    migrations: ['src/db/migrations/**/*.ts'],
    subscribers: []
})