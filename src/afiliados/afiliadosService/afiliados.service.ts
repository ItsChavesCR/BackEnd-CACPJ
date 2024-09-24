/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';
import { Repository } from 'typeorm';
import { CreateAfiliadoDto } from '../afiliadosDto/create-afiliados.dto';
import { UpdateAfiliadoDto } from '../afiliadosDto/update-afiliados.dto';
import { join, resolve } from 'path';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class AfiliadosService {

    constructor(
        @InjectRepository(Afiliado) private afiliadosRepository: Repository<Afiliado>,
    ) { }

    getAfiliados() {
        return this.afiliadosRepository.find();
    }

    async getAfiliado(afiliadoId: number) {
        const afiliadoFound = await this.afiliadosRepository.findOne({
            where: { afiliadoId }
        });
        if (!afiliadoFound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return afiliadoFound;
    }

    async createAfiliado(afiliado: CreateAfiliadoDto): Promise<Afiliado> {
        if (!/^\d{9}$/.test(afiliado.cedula)) {
            throw new BadRequestException('La cédula debe tener 9 dígitos');
        }

        const afiliadoFound = await this.afiliadosRepository.findOne({ where: { cedula: afiliado.cedula } });
        if (afiliadoFound) {
            throw new HttpException('Afiliado already exists', HttpStatus.CONFLICT);
        }

        const newAfiliado = this.afiliadosRepository.create({ ...afiliado });
        return await this.afiliadosRepository.save(newAfiliado);
    }

    async updateAfiliado(afiliadoId: number, afiliado: UpdateAfiliadoDto) {
        const result = await this.afiliadosRepository.update({ afiliadoId }, afiliado);
        if (result.affected === 0) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async deleteAfiliado(afiliadoId: number) {
        const result = await this.afiliadosRepository.delete({ afiliadoId });
        if (result.affected === 0) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async getAfiliadosWithFilters(ubicacion?: string, genero?: string, actividades?: string, comercializa?: boolean): Promise<Afiliado[]> {
        const queryBuilder = this.afiliadosRepository.createQueryBuilder('afiliado');
        if (ubicacion) {
            queryBuilder.andWhere('afiliado.direccion LIKE :ubicacion', { ubicacion: `%${ubicacion}%` });
        }
        if (genero) {
            queryBuilder.andWhere('afiliado.genero = :genero', { genero });
        }
        if (actividades) {
            queryBuilder.andWhere('afiliado.actividadesAgricolas LIKE :actividades', { actividades: `%${actividades}%` });
        }
        if (comercializa !== undefined) {
            queryBuilder.andWhere('afiliado.comercializacion = :comercializa', { comercializa });
        }
        return await queryBuilder.getMany();
    }

    async generarPDFafiliado(filtros: { ubicacion?: string, genero?: string, actividades?: string, comercializa?: boolean }): Promise<Buffer> {
        const afiliados = await this.getAfiliadosWithFilters(filtros.ubicacion, filtros.genero, filtros.actividades, filtros.comercializa);

        const totalAfiliados = afiliados.length;
        const afiliadosPorGenero = {
            masculino: afiliados.filter(a => a.genero === 'M').length,
            femenino: afiliados.filter(a => a.genero === 'F').length,
        };
        const actividadesAgricolas = this.calcularActividadesAgricolas(afiliados);

        const pdfBuffer: Buffer = await new Promise(resolve => {
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

            doc.font("Helvetica-Bold").fontSize(20).text("Reporte de Afiliados", { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Total de Afiliados: ${totalAfiliados}`);
            doc.fontSize(14).text(`Masculinos: ${afiliadosPorGenero.masculino}`);
            doc.fontSize(14).text(`Femeninos: ${afiliadosPorGenero.femenino}`);
            doc.fontSize(14).text(`Actividades más comunes: ${actividadesAgricolas}`);
            doc.moveDown();

            const table = {
                headers: ["#", "Nombre Completo", "Cédula", "Correo", "Género", "Teléfono", "Año Nac.", "Comercializa", "Actividades"],
                rows: afiliados.map((afiliado, index) => [
                    index + 1,
                    afiliado.nombreCompleto,
                    afiliado.cedula,
                    afiliado.correo,
                    afiliado.genero,
                    afiliado.telefono.toString(),
                    afiliado.annoNacimiento.toString(),
                    afiliado.comercializacion ? 'Sí' : 'No',
                    afiliado.actividadesAgricolas
                ])
            };

            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: (row, i) => doc.font("Helvetica").fontSize(9),
                columnsSize: [20, 120, 70, 120, 40, 60, 50, 100, 100],
            });

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });
            doc.end();
        });

        return pdfBuffer;
    }

    // Aquí colocamos el método para calcular las actividades más comunes
    calcularActividadesAgricolas(afiliados: Afiliado[]): string {
        const actividadesMap = new Map<string, number>();

        afiliados.forEach(afiliado => {
            const actividades = afiliado.actividadesAgricolas.split(',').map(a => a.trim());
            actividades.forEach(actividad => {
                actividadesMap.set(actividad, (actividadesMap.get(actividad) || 0) + 1);
            });
        });

        return Array.from(actividadesMap.entries())
            .sort((a, b) => b[1] - a[1])  // Ordenar de mayor a menor
            .slice(0, 3)  // Tomar las 3 actividades más comunes
            .map(([actividad]) => actividad)
            .join(', ');
    }

}
