import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('event_participants')
@Index('UQ_EVENT_PARTICIPANT_EVENT_USER', ['eventId', 'userId'], { unique: true })
export class EventParticipant {
    @PrimaryGeneratedColumn('uuid')
    id!: string


}