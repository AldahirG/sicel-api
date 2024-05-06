import { PartialType } from '@nestjs/mapped-types';
import { CreateAsetnameDto } from './create-asetname.dto';

export class UpdateAsetnameDto extends PartialType(CreateAsetnameDto) {}
