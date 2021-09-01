import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    
} from 'typeorm';
//import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column(/* , {
        unique: true
    } */)
    /* @IsNotEmpty() */
    email!: string;

    @Column()
   /*  @Length(3, 100) */
    password!: string;    
    
    @Column('boolean', {default: false})
    isAdmin: boolean;
    
    @Column()
    @CreateDateColumn()        
    createdAt!: Date;     

    @Column()
    @UpdateDateColumn()        
    updatedAt!: Date;
    
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
    

}