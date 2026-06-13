import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity("refresh_token_sessions")
export class RefreshTokenSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 120})
    userId!: number;
    
    @Column({type: "varchar", length: 120})
    tokenHash!: string;

    @Column({type: "varchar", length: 120})
    expiresAt!: string;

    @Column({type: "varchar", length: 120})
    revokedAt!: string;
    
    @Column({type: "varchar", length: 120})
    createdAt!: string;

}