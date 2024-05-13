import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ProcessFileService } from '../process-file/process-file.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, ProcessFileService],
})
export class LeadsModule { }
