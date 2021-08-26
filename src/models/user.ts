import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BaseEntity
} from 'typeorm';
import {RefreshToken} from './token'
import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";

@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id!: number;

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
    
    @Column()
    role!: string;

   /*  @Column({ array: true })
    refreshTokens!: [{ token: String }]; */
    
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.tokens)
    refreshTokens!: RefreshToken[];

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