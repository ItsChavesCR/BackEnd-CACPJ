import { PartialType } from '@nestjs/mapped-types';
import { CreateInformativaDto } from './create-areaInformativa.dto';

export class UpdateInformativaDto extends PartialType(CreateInformativaDto) {}
