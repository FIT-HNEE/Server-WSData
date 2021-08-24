import {MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from '../models/user'
export class CreateAdminUser1629767046455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        let user = new User();
        user.email = "admin";
        user.password = "admin";
        user.hashPassword();
        user.role = "ADMIN";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
