import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity("refresh_token_sessions")
export class RefreshTokenSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", length: 120})
    userId!: number;
    
    @Column({type: "varchar", length: 120})
    tokenHash!: string;

    @Column({type: "timestamp"})
    expiresAt!: Date;

    @Column({type: "timestamp"})
    revokedAt!: Date | null;

    @Column({type: "timestamp"})
    createdAt!: Date;

}