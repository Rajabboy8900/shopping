import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCategoriesRelations123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Avval bog'liq cheklovlarni o'chiramiz
    await queryRunner.query(`
      ALTER TABLE products DROP CONSTRAINT IF EXISTS fk_product_category;
      ALTER TABLE comments DROP CONSTRAINT IF EXISTS fk_comment_category;
    `);
    
    // 2. Asosiy jadvalni o'zgartiramiz
    await queryRunner.query(`
      ALTER TABLE categories 
      ALTER COLUMN id TYPE uuid USING id::uuid,
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    `);
    
    // 3. Bog'liqliklarni qayta o'rnatamiz
    await queryRunner.query(`
      ALTER TABLE products ADD CONSTRAINT fk_product_category
        FOREIGN KEY (categoryId) REFERENCES categories(id)
        ON DELETE CASCADE;
        
      ALTER TABLE comments ADD CONSTRAINT fk_comment_category
        FOREIGN KEY (categoryId) REFERENCES categories(id)
        ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Orqaga qaytarish jarayoni
    await queryRunner.query(`
      ALTER TABLE products DROP CONSTRAINT fk_product_category;
      ALTER TABLE comments DROP CONSTRAINT fk_comment_category;
      
      ALTER TABLE categories 
      ALTER COLUMN id TYPE integer USING id::integer,
      ALTER COLUMN id DROP DEFAULT;
    `);
  }
}