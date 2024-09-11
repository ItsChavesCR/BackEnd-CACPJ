import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { Psa } from '../psaEntities/Psa.entity';
import { PsaService } from '../psaServices/psa.service';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';



@Controller('psa')
export class PsaController {
    constructor(private readonly psaService: PsaService) {}

    @Get()
    getPsa(): Promise<Psa[]> {
        return this.psaService.getPsa();
    }

    @Get(':id')
    getPsaById(@Param('id', ParseIntPipe) id: number): Promise<Psa> {
        return this.psaService.getPsaById(id);
    }

    @Post()
    create(@Body() createDto: CreatePsaDto): Promise<Psa> {
        return this.psaService.createPsa(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.psaService.deletePsa(id);
    }

    @Patch(':id')
    updatePsa(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreatePsaDto) {
        return this.psaService.updatePsa(id, updateDto);
    }
}
