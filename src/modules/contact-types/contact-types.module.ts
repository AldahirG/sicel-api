import { Module } from '@nestjs/common';
import { ContactTypesService } from './contact-types.service';
import { ContactTypesController } from './contact-types.controller';

@Module({
  controllers: [ContactTypesController],
  providers: [ContactTypesService],
})
export class ContactTypesModule {}
