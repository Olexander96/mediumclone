//npm run db:create src/migrations/CreateTags - створили міграцію
//npm run db:migrate - запустили міграцію і створилась таблиця tags (інформація по створенню описата в tag.entity.ts)
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTags1741340078025 implements MigrationInterface {
  name = 'CreateTags1741340078025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}

//Міграції - це файли в яких міститься інформація щодо зміни бази даних, де ми можемо подивитись історію змін та визначити поточний стан бази даних

//Розшифрування команди typeorm
// "typeorm": - це назва скрипту в package.json, який можна запустити через npm run typeorm
// ts-node - це утиліта для запуску TypeScript коду без попередньої компіляції в JavaScript

// -r tsconfig-paths/register - завантажує модуль tsconfig-paths/register, який дозволяє використовувати шляхи, визначені в tsconfig.json

// ./node_modules/typeorm/cli.js - шлях до файлу інтерфейсу командного рядка TypeORM

// -d src/ormdatasource.ts - параметр -d вказує на файл конфігурації бази даних (datasource), в цьому випадку розташований за шляхом src/ormdatasource.ts

//Також створиди інші команди
//"db:drop" - видалити всі таблиці

//команда створення міграції "db:create"
// npm run db:create src/migrations/CreateTags - в цій міграції описані команди по створенню таблиці і видаленню

//команда запуску міграції "db:migrate"
//npm run db:migrate - накатує ті міграції (тобто інструкція по створенню табл яка в міграції виконується) + створює тіблицю по міграціям migrations де зберігається вся інфа по ним
