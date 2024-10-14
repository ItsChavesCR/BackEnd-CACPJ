
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envios } from '../ganaderiaEntities/envios.entity';
import { CreateEnviosDto } from '../ganaderiaDto/create-envios.dto';
import { UpdateEnviosDto } from '../ganaderiaDto/update-envios.dto';
import { Ganadero } from '../ganaderiaEntities/ganadero.entity'; // Importa Ganadero para buscarlo

const PDFDocument = require('pdfkit-table');

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envios)
    private readonly enviosRepository: Repository<Envios>,

    @InjectRepository(Ganadero) // Repositorio para Ganadero
    private readonly ganaderoRepository: Repository<Ganadero>,
  ) { }

  // Método para obtener todos los envíos
  async findAll(): Promise<Envios[]> {
    return this.enviosRepository.find({ relations: ['ganadero'] });
  }

  async create(createEnviosDto: CreateEnviosDto): Promise<Envios> {
    const { idGanadero, ...rest } = createEnviosDto;

    // Busca el Ganadero en la base de datos usando el objeto de búsqueda correcto
    const ganadero = await this.ganaderoRepository.findOne({
      where: { idGanadero }, // Usa la opción "where" para buscar por idGanadero
    });

    if (!ganadero) {
      throw new NotFoundException(`Ganadero with ID ${idGanadero} not found`);
    }

    // Crea el envío con el Ganadero asociado
    const envio = this.enviosRepository.create({
      ...rest,
      ganadero, // Asocia el Ganadero encontrado
    });

    return this.enviosRepository.save(envio);
  }

  async findOne(id: number): Promise<Envios> {
    const envio = await this.enviosRepository.findOne({
      where: { idEnvio: id },
      relations: ['ganadero'],
    });
    if (!envio) {
      throw new NotFoundException(`Envio with ID ${id} not found`);
    }
    return envio;
  }

  async update(id: number, updateEnviosDto: UpdateEnviosDto): Promise<Envios> {
    const envio = await this.enviosRepository.preload({
      idEnvio: id,
      ...updateEnviosDto,
    });
    if (!envio) {
      throw new NotFoundException(`Envio with ID ${id} not found`);
    }
    return this.enviosRepository.save(envio);
  }

  /*
  async remove(id: number): Promise<void> {
    const envio = await this.findOne(id);
    await this.enviosRepository.remove(envio);
  }

  */

  async getEnviosWithFilters(filtros: { idGanadero?: number, fechaInicio?: Date, fechaFin?: Date }): Promise<Envios[]> {
    const query = this.enviosRepository.createQueryBuilder('envios')
      .leftJoinAndSelect('envios.ganadero', 'ganadero')
      .leftJoinAndSelect('ganadero.afiliado', 'afiliado'); // Incluir la relación con afiliado

    // Filtro por ID del ganadero
    if (filtros.idGanadero) {
      query.andWhere('ganadero.idGanadero = :idGanadero', { idGanadero: filtros.idGanadero });
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      query.andWhere('envios.fechaEnvio BETWEEN :fechaInicio AND :fechaFin', { fechaInicio: filtros.fechaInicio, fechaFin: filtros.fechaFin });
    }
    // Filtro por una fecha específica
    else if (filtros.fechaInicio) {
      query.andWhere('envios.fechaEnvio = :fechaInicio', { fechaInicio: filtros.fechaInicio });
    }

    // Ejecutamos la consulta y retornamos los resultados
    return await query.getMany();
  }



  // Método para generar el PDF con los envíos filtrados
  async generarPDFEnvios(filtros: { idGanadero?: number, fechaInicio?: Date, fechaFin?: Date }): Promise<Buffer> {
    try {
      // Obtenemos los envíos filtrados
      const envios = await this.getEnviosWithFilters(filtros);

      // Creamos el buffer para generar el PDF
      const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          size: 'LETTER',
          bufferPages: true,
          autoFirstPage: true,
          margins: { top: 50, left: 50, right: 50, bottom: 50 },
        });

        let pageNumber = 0;

        doc.on('pageAdded', () => {
          pageNumber++;
          let bottom = doc.page.margins.bottom;

          doc.page.margins.bottom = 0;
          doc.font('Helvetica').fontSize(12);
          doc.text(
            'Pág. ' + pageNumber,
            0.5 * (doc.page.width - 100),
            doc.page.height - 50,
            { width: 100, align: 'center', lineBreak: false },
          );
          doc.page.margins.bottom = bottom;
        });

        // Título del reporte
        doc.font('Helvetica-Bold').fontSize(20).text('Reporte de Envíos', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Total de envíos: ${envios.length}`);
        doc.moveDown();

        // Mostrar cada envío en formato listado
        envios.forEach((envio, index) => {
          const fechaEnvio = new Date(envio.fechaEnvio); // Aseguramos que sea una instancia de Date
          doc.font('Helvetica-Bold').fontSize(14).text(`Envío #${index + 1}`);

          // Verificar que ganadero y afiliado no sean undefined
          const nombreCompletoGanadero = envio.ganadero?.afiliado?.nombreCompleto || 'Desconocido';

          doc.font('Helvetica').fontSize(12).text(`Fecha de Envío: ${fechaEnvio.toISOString().slice(0, 10)}`);
          doc.text(`Ganadero: ${nombreCompletoGanadero}`);
          doc.text(`Total Hembras: ${envio.totalHembras}`);
          doc.text(`Total Machos: ${envio.totalMachos}`);
          doc.text(`Peso en Pie: ${envio.pesoEnPie}`);
          doc.text(`Peso Canal: ${envio.pesoCanal}`);
          doc.text(`Monto Total: ${envio.montoTotal}`);
          doc.text(`Bono Productor: ${envio.bonoProductor}`);
          doc.text(`Reconocimiento: ${envio.reconocimiento}`);
          doc.text(`Excedente: ${envio.excedente || 0}`);
          doc.moveDown();
        });

        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });

        // Manejar errores
        doc.on('error', (err) => {
          reject(err);
        });

        doc.end();
      });

      return pdfBuffer;  // Retornamos el buffer resultante
    } catch (error) {
      console.error('Error generating PDF:', error);
      return Buffer.from('');  // Retornamos un buffer vacío en caso de error
    }
  }

}
