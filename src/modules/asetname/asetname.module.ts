import { Module } from '@nestjs/common'
import { AsetnameService } from './asetname.service'
import { AsetnameController } from './asetname.controller'

@Module({
	controllers: [AsetnameController],
	providers: [AsetnameService],
})
export class AsetnameModule {}
