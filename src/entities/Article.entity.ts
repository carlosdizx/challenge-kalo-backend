import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import User from "./User.entity";
@Entity({name: "articles"})
export default class Article extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name:"title", type: "varchar"})
    title: string;

    @Column({name:"body", type: "text"})
    body: string;

    @Column({name:"id_wordpress", type: "int", unique: true})
    idWordPress: number;

    @ManyToOne(() => User, user => user.articles)
    @JoinColumn({name: "user_id"})
    user: User;
}
