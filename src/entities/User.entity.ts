import {Entity, PrimaryGeneratedColumn, BaseEntity, Column, OneToMany} from "typeorm"
import {TypesUser} from "../Enums/typesUser";
import Article from "./Article.entity";

@Entity({name: "users"})
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name: "name", type: "varchar"})
    name: string;

    @Column({name: "email", type: "varchar", unique: true})
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

    @OneToMany(() => Article, article => article.user)
    articles: Article[];
}
