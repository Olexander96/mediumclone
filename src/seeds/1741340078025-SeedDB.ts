import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1741340078025 implements MigrationInterface {
  //ЦЕ мыграція для дефолтних даних (щоб в таблицях було пару записів)
  name = 'SeedDB1741340078025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'),('coffe'),('Nestjs')`,
    );

    await queryRunner.query(
      //password 123 (захкшований - $2b$10$mrlZCemCiIAjSX0LoZu1guchdf804LndU6BeN3.pdvSOFdzV/rK0m)
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$mrlZCemCiIAjSX0LoZu1guchdf804LndU6BeN3.pdvSOFdzV/rK0m')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug,title, description, body, "tagList", "authorId") VALUES 
      ('first-article', 'Article 1', 'Article 1 description text', 'Article 1 body text', 'coffe,dragons', 1), 
      ('second-article', 'Article 2', 'Article 2 description text', 'Article 2 body text', 'Nestjs,dragons', 1),
      ('third-article', 'Article 3', 'Article 3 description text', 'Article 3 body text', 'coffe,Nestjs', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
