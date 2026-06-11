import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type : "varchar", length : 120})
    name!: string;

    @Column({type: "varchar", length: 120})
    email!: string;

    @Column({type: "varchar", length: 120 })
    hashPassword!: string;
}
