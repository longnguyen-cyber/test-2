import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LangCode } from '../constant';

export type LangCodeInfo = {
  lang: LangCode;
};

export const LanguageCodeDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LangCodeInfo => {
    const request = ctx.switchToHttp().getRequest();
    const langcode = request.headers['x-custom-lang'];
    return { lang: langcode.toLowerCase() };
  },
);
