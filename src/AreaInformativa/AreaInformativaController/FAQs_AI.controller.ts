import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { FAQsAiService } from '../AreaInformativaServices/FAQs_AI.service';
import { FAQsAi } from '../AreaInformativaEntities/FAQs_AI.entity';
import { CreateFAQsDto } from '../AreaInformativaDto/create-FAQs.dto';
import { UpdateFAQsDto } from '../AreaInformativaDto/update-FAQs.dto';

@Controller('FAQs_AI')
export class FAQsController {

    constructor(private readonly fAQsService: FAQsAiService) {}

    @Get()
    getFAQs(): Promise<FAQsAi[]> {
        return this.fAQsService.getFAQs();
    }

    @Get(':id')
    getFAQsById(@Param('id', ParseIntPipe) id: number): Promise<FAQsAi> {
        return this.fAQsService.getFAQsById(id);
    }

    @Post()
create(@Body() createDto: CreateFAQsDto): Promise<FAQsAi> {
    return this.fAQsService.createFAQs(createDto);
}


    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.fAQsService.deleteFAQs(id);
    }

    @Patch(':id')
    updateFAQs(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateFAQsDto) {
        return this.fAQsService.updateFAQs(id, updateDto);
    }
}
