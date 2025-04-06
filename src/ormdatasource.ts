import { DataSource } from 'typeorm';
import ormconfig from '@app/ormconfig';

export default new DataSource(ormconfig); //створили команду typeorm в package.json
