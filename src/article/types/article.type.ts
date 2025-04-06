import { ArticleEntity } from '../articte.entity';

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>; //ми створиди тим об'єкта article на основі його сутності ArticleType але ле видалили метод updateTimestamp він нам не потрібен при додаванні поля favorited до статті
