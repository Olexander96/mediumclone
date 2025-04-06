import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'; //це такий модуль (бібліотека) яка використовується для ізолованої роботи з базами даних

const ormconfig: PostgresConnectionOptions = {
  //тут описуємо налаштування для взаємодії з базою даних postgres
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  entities: [__dirname + '/**/*entity{.ts,.js}'], //задаємо шлях до entity який буде використовуватись при взаэмодії з базою даних
  synchronize: false, //каже що при запуску додатку наш TypeORM зчитуэ всі сутності (entityes) і створює під них таблиці (на продакшині краще ставити false)
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], //описуємо шлях до файлів міграції (Міграції - це файли які містять інформації по взаємодії з базою даних, що додавалось, видалялось і т д, це схоже на коміти)
};

export default ormconfig;
