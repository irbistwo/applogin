import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';
// This should be a real class/interface representing a user entity
export type Usertypeany = any;

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findOne(
    email: string,
    password: string,
  ): Promise<Usertypeany | undefined> {
    const sql =
      'select id,name,email,password from public.users ' +
      'where email=$1 and coalesce(is_locked,0)=0';
    const rows = await this.dbService.query(sql, [email]);
    console.log(rows);
    if (rows.length === 0) return { is_valid: false };
    const passwordhash = rows[0].password;
    const is_validpass = await this.comparepassword(password, passwordhash);
    if (is_validpass)
      return { is_valid: true, username: rows[0].name, id: rows[0].id };

    return { is_valid: false };
  }
  async get_hashpassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async comparepassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
  async insertUser(usersobject: any) {
    console.log('userservice25', usersobject);
    const hashpass = await this.get_hashpassword(usersobject.password);
    const sql =
      'insert into users(id,name,email,password,data_create)' +
      " values(nextval('id_users'),$1,$2,$3,now())";
    const res = await this.dbService.executeSQL(sql, [
      usersobject.username,
      usersobject.email,
      hashpass,
    ]);
    return res;
  }

  async getUser(user_id: number) {
    const sql =
      'select id,name,email,data_create from public.users ' + 'where id=$1';
    const rows = await this.dbService.query(sql, [user_id]);
    return {
      username: rows[0].name,
      email: rows[0].email,
      datacreate: rows[0].data_create,
    };
  }
}
