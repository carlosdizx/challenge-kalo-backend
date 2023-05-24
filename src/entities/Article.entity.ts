import {BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User.entity";

export default class Article extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => User, user => user.articles)
    user: User;
}
