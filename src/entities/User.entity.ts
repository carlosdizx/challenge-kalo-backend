import {Entity, PrimaryGeneratedColumn, BaseEntity, Column} from "typeorm"
import {TypesUser} from "../Enums/typesUser";

@Entity({name: "users"})
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({name: "name", type: "varchar"})
    name: string;

    @Column({name: "email", type: "varchar"})
    email: string;

    @Column({name: "password", type: "varchar"})
    password: string;

    @Column({
        name: "type",
        type: "enum",
        enum: TypesUser,
        default: TypesUser.USER
    })
    type: TypesUser;
}
