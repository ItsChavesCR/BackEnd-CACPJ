import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FAQsAi } from '../AreaInformativaEntities/FAQs_AI.entity';
import { FAQsController } from '../AreaInformativaController/FAQs_AI.controller';
import { FAQsAiService } from '../AreaInformativaServices/FAQs_AI.service';


@Module({
  imports: [TypeOrmModule.forFeature([FAQsAi])],
  controllers: [FAQsController],
  providers: [FAQsAiService],
})
export class FAQsModule {}