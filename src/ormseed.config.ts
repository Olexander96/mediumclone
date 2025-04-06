import ormconfig from '@app/ormconfig';

const ormseedconfig = {
  //налаштування для того щоб зчитувати міграції з папки seed (це початкові дефолтні тані, щоб таблиці не були пусті!!!)
  ...ormconfig,
  migrations: ['src/seeds/*.ts'],
};

export default ormseedconfig;
