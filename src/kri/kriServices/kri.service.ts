import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FiltroResultadosKriDto } from '../kriDto/filtro-resultados-kri.dto';
import { IndicadorKri } from '../kriEntities/indicador-kri.entity';
import { ResultadoKri } from '../kriEntities/resultado-kri.entity';

@Injectable()
export class KriService {
  constructor(
    @InjectRepository(IndicadorKri)
    private readonly indicadorRepository: Repository<IndicadorKri>,
    @InjectRepository(ResultadoKri)
    private readonly resultadoRepository: Repository<ResultadoKri>,
  ) {}

  findIndicadoresActivos(): Promise<IndicadorKri[]> {
    return this.indicadorRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC', idIndicador: 'ASC' },
    });
  }

  findResultados(filtros: FiltroResultadosKriDto = {}): Promise<ResultadoKri[]> {
    const where: FindOptionsWhere<ResultadoKri> = {};

    if (filtros.idIndicador !== undefined) {
      where.idIndicador = filtros.idIndicador;
    }
    if (filtros.periodo !== undefined) {
      where.periodo = filtros.periodo;
    }
    if (filtros.clasificacion !== undefined) {
      where.clasificacion = filtros.clasificacion;
    }

    return this.resultadoRepository.find({
      where,
      relations: { indicador: true },
      order: { periodo: 'DESC', idResultado: 'DESC' },
    });
  }
}
