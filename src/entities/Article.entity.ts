import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User.entity";
@Entity({name: "articles"})
export default class Article extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name:"title", type: "varchar"})
    title: string;

    @Column({name:"body", type: "varchar"})
    body: string;

    @ManyToOne(() => User, user => user.articles)
    user: User;
}
