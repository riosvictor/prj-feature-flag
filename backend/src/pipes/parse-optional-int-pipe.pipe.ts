import { ArgumentMetadata, ParseIntPipe } from '@nestjs/common';

export class ParseOptionalIntPipe extends ParseIntPipe {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value === undefined) {
      return undefined;
    }

    return super.transform(value, metadata);
  }
}
