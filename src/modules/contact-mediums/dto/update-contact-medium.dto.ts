import { PartialType } from '@nestjs/mapped-types';
import { CreateContactMediumDto } from './create-contact-medium.dto';

export class UpdateContactMediumDto extends PartialType(CreateContactMediumDto) {}
