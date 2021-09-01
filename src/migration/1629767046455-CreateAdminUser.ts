import {MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from '../models/user';
import {Admin} from './seed'
export class CreateAdminUser1629767046455 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<any> {
    await getRepository(User).save(
      Admin
        );
        console.log('User', User)
    
  }

  public async down(_: QueryRunner): Promise<any> {
    // do nothing
  }

}
