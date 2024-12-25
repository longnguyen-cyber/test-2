import { Injectable } from '@nestjs/common';
import { Translation } from 'src/domain/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class TranslationService {
  constructor(private readonly dataSource: DataSource) {}

  async getTranstalion(
    langCode: string,
    ids: string[],
    tableName: string,
  ): Promise<Map<string, string>> {
    const translations = await this.dataSource
      .createQueryBuilder(Translation, 'translation')
      .where('translation.table_name = :tableName', { tableName })
      .andWhere('translation.record_id IN (:...topicIds)', { topicIds: ids })
      .andWhere('translation.language_code = :langCode', { langCode })
      .getMany();
    const translationMap = new Map();
    translations.forEach((translation) => {
      const value =
        tableName === 'health_topic_habits'
          ? `${translation.translation}_${translation.description}`
          : translation.translation;
      translationMap.set(translation.record_id, value);
    });

    return translationMap;
  }
}
