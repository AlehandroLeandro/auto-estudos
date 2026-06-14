import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity("sessions")
export class Session {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", length: 120})
    userId!: number;
    
    @Column({type: "varchar", length: 120})
    refreshTokenHash!: string;

    @Column({type: "timestamp"})
    expiresAt!: Date;

    @Column({type: "timestamp", nullable: true})
    revokedAt!: Date | null;

    @Column({type: "timestamp"})
    createdAt!: Date;

}
