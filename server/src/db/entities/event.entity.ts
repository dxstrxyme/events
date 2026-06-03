import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('Events')


export class Event {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 200 })
    title!: string

    @Column({ type: 'text' })
    description!: string

    @Column({ type: 'int' })
    capacity!: number

    @Column({ type: 'varchar', length: 200 })
    address!: string

    @Column({ type: 'timestamptz' })
    startedAt!: Date

    owner!: User
}