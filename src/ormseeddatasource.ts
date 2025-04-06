import { DataSource } from 'typeorm';
import ormSeedConfig from '@app/ormseed.config';

export default new DataSource(ormSeedConfig); //в packege.json під нього прописана команда db:seed
//db:seed активує цей файл який в свою чергу дивиться в налаштування ormseed.config і потім накатує міграції в папці src/seeds
