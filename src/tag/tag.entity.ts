//Entity - сутність яку ми створює, і за допомогою неї можна створювати таблиці та взаємодіяти з нею
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' }) //tags - назва таблиці
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
