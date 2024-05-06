import { Module } from '@nestjs/common';
import { ContactMediumsService } from './contact-mediums.service';
import { ContactMediumsController } from './contact-mediums.controller';

@Module({
  controllers: [ContactMediumsController],
  providers: [ContactMediumsService],
})
export class ContactMediumsModule {}
