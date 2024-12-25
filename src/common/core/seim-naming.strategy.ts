import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import * as pluralize from 'pluralize';

export class SeimNamingStrategy extends DefaultNamingStrategy {
  // eslint-disable-next-line class-methods-use-this
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName || pluralize(snakeCase(targetName));
  }
}
