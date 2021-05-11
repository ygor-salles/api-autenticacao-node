import { Column, CreateDateColumn, Entity, PrimaryColumn, BeforeInsert, BeforeUpdate, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'

@Entity('users')
class User {

    @PrimaryColumn()
    readonly id: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column()
    admin: boolean

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    @CreateDateColumn()
    created_at: Date

    @DeleteDateColumn()
    deleted_at: Date

    @UpdateDateColumn()
    updated_at: Date

    constructor(){
        if(!this.id){
            this.id = uuid()
        }
    }
}

export { User }