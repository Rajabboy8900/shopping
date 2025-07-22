import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEmailColumn123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      RENAME COLUMN email TO email_address;
      
      -- Agar ustun mavjud bo'lmasa
      -- ALTER TABLE users ADD COLUMN email_address VARCHAR(255) UNIQUE;
      -- UPDATE users SET email_address = email;
      -- ALTER TABLE users DROP COLUMN email;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      RENAME COLUMN email_address TO email;
    `);
  }
}