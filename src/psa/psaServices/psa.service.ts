import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psa } from '../psaEntities/Psa.entity';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';
import { Modalidad } from '../psaEntities/modalidad.entity';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class PsaService {
  constructor(
    @InjectRepository(Psa) private psaRepository: Repository<Psa>,
    @InjectRepository(Modalidad) private modalidadRepository: Repository<Modalidad>,
  ) { }

  async createPsa(createDto: CreatePsaDto): Promise<Psa> {
    // Validar que la cédula tenga 9 dígitos
    if (!/^\d{9}$/.test(createDto.Cedula)) {
      throw new BadRequestException('La cédula debe tener 9 dígitos');
    }

    // Buscar si la modalidad existe por su nombre
    const modalidad = await this.modalidadRepository.findOne({
      where: { Nombre_Modalidad: createDto.Nombre_Modalidad },
    });

    // Si no existe la modalidad, lanzar una excepción
    if (!modalidad) {
      throw new BadRequestException('La modalidad indicada no existe');
    }

    // Crear el nuevo PSA asignando la modalidad
    const newPsa = this.psaRepository.create({
      ...createDto,
      modalidad: modalidad, // Asignar el objeto Modalidad encontrado
    });

    // Guardar el nuevo PSA
    return this.psaRepository.save(newPsa);
  }

  async getPsa(): Promise<Psa[]> {
    return this.psaRepository.find({
      relations: ['modalidad'], // Asegúrate de cargar la relación con modalidad
    });
  }


  async getPsaById(id: number): Promise<Psa> {
    return this.psaRepository.findOne({
      where: { Id_Psa: id },
      relations: ['modalidad'], // Asegúrate de cargar la relación con modalidad
    });
  }


  deletePsa(id: number) {
    return this.psaRepository.delete({ Id_Psa: id });
  }

  updatePsa(id: number, updateDto: CreatePsaDto) {
    return this.psaRepository.update({ Id_Psa: id }, updateDto);
  }

  async generarPDFPsa(filtros: { ubicacion?: string, modalidad?: string, cedula?:string}): Promise<Buffer> {
    try {
        // Filtrar los datos de PSA según los filtros recibidos
        const psas = await this.getPsaWithFilters(filtros.ubicacion, filtros.modalidad, filtros.cedula);

    

        const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "LETTER",
                bufferPages: true,
                autoFirstPage: true,
                margins: { top: 50, left: 50, right: 50, bottom: 50 }
            });

            let pageNumber = 0;

            doc.on('pageAdded', () => {
                pageNumber++;
                let bottom = doc.page.margins.bottom;

                doc.page.margins.bottom = 0;
                doc.font("Helvetica").fontSize(12);
                doc.text(
                    'Pág. ' + pageNumber,
                    0.5 * (doc.page.width - 100),
                    doc.page.height - 50,
                    { width: 100, align: 'center', lineBreak: false }
                );
                doc.page.margins.bottom = bottom;
            });

            // Título del reporte
            doc.font("Helvetica-Bold").fontSize(20).text("Reporte de PSA", { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Total de PSA: ${psas.length}`);
            doc.moveDown();

            // Mostrar cada PSA en formato listado
            psas.forEach((psa, index) => {
                doc.font("Helvetica-Bold").fontSize(14).text(`PSA #${index + 1}`);
                doc.font("Helvetica").fontSize(12).text(`Nombre Completo: ${psa.Nombre_Completo}`);
                doc.text(`Cédula: ${psa.Cedula}`);
                doc.text(`Teléfono: ${psa.Telefono}`);
                doc.text(`Correo: ${psa.Correo}`);
                doc.text(`Ubicación: ${psa.Ubicacion}`);
                doc.text(`Area Efectiva: ${Number(psa.Area_Efectiva)} `);
                doc.text(`Área Total: ${Number(psa.Area_Total)}`);
                doc.text(`Modalidad: ${psa.modalidad ? psa.modalidad.Nombre_Modalidad : 'N/A'}`);
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
                reject(err); // Llama a reject si ocurre un error
            });

            doc.end();
        });

        return pdfBuffer;  // Asegúrate de devolver el buffer resultante
    } catch (error) {
        console.error("Error generating PDF:", error);
        return Buffer.from('');  // Retorna un buffer vacío en caso de error
    }
}


  async getPsaWithFilters(ubicacion?: string, modalidad?: string, cedula?:string): Promise<Psa[]> {
    const query = this.psaRepository.createQueryBuilder('psa')
      .leftJoinAndSelect('psa.modalidad', 'modalidad');  // Relacionar la entidad Modalidad si es necesario

    if (ubicacion) {
      query.andWhere('psa.Ubicacion = :ubicacion', { ubicacion });
    }

    if (modalidad) {
      query.andWhere('modalidad.Nombre_Modalidad = :modalidad', { modalidad });
    }
    if(cedula){
      query.andWhere('psa.Cedula = :cedula', {cedula})
    }

    return await query.getMany();
  }


}
