/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';
import { Repository } from 'typeorm';
import { CreateAfiliadoDto } from '../afiliadosDto/create-afiliados.dto';
import { UpdateAfiliadoDto } from '../afiliadosDto/update-afiliados.dto';
import { Ganadero } from 'src/ganaderia/ganaderiaEntities/ganadero.entity';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class AfiliadosService {
  constructor(
    @InjectRepository(Afiliado)
    private afiliadosRepository: Repository<Afiliado>,
  ) {}

  // Traer todos los afiliados, tanto activos como inactivos
  getAfiliados() {
    return this.afiliadosRepository.find();
  }

  async getAfiliado(afiliadoId: number) {
    const afiliadoFound = await this.afiliadosRepository.findOne({
      where: { afiliadoId },
    });
    if (!afiliadoFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return afiliadoFound;
  }

  async createAfiliado(afiliado: CreateAfiliadoDto): Promise<Afiliado> {
    if (!/^\d{9,10}$/.test(afiliado.cedula)) {
      throw new BadRequestException(
        'La cédula debe tener 9 o 10 dígitos numéricos',
      );
    }

    const afiliadoFound = await this.afiliadosRepository.findOne({
      where: { cedula: afiliado.cedula },
    });
    if (afiliadoFound) {
      throw new HttpException('Afiliado already exists', HttpStatus.CONFLICT);
    }

    const newAfiliado = this.afiliadosRepository.create({ ...afiliado });
    const savedAfiliado = await this.afiliadosRepository.save(newAfiliado);

    // Crear el registro en la tabla Ganadero si el afiliado comercializa
    if (afiliado.comercializacion) {
      const ganaderoRepository =
        this.afiliadosRepository.manager.getRepository(Ganadero);
      const newGanadero = ganaderoRepository.create({
        idGanadero: savedAfiliado.afiliadoId, // Usa el id del afiliado como idGanadero
      });
      await ganaderoRepository.save(newGanadero);
    }

    return savedAfiliado;
  }

  async updateAfiliado(afiliadoId: number, afiliado: UpdateAfiliadoDto) {
    const result = await this.afiliadosRepository.update(
      { afiliadoId },
      afiliado,
    );

    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Lógica adicional para manejar la relación con la tabla Ganadero
    const ganaderoRepository =
      this.afiliadosRepository.manager.getRepository(Ganadero);

    // Verificar si el afiliado actualizado comercializa
    if (afiliado.comercializacion) {
      const existingGanadero = await ganaderoRepository.findOne({
        where: { idGanadero: afiliadoId },
      });

      // Si no existe en Ganadero, lo creamos
      if (!existingGanadero) {
        const newGanadero = ganaderoRepository.create({
          idGanadero: afiliadoId,
        });
        await ganaderoRepository.save(newGanadero);
      }
    } else {
      // Si no comercializa y existe en Ganadero, lo eliminamos
      await ganaderoRepository.delete({ idGanadero: afiliadoId });
    }

    return result;
  }

  async deactivateAfiliado(afiliadoId: number) {
    const afiliado = await this.afiliadosRepository.findOne({
      where: { afiliadoId },
    });
    if (!afiliado) {
      throw new HttpException('Afiliado no encontrado', HttpStatus.NOT_FOUND);
    }
    afiliado.isActive = false;
    return this.afiliadosRepository.save(afiliado);
  }

  async reactivateAfiliado(afiliadoId: number) {
    const afiliado = await this.afiliadosRepository.findOne({
      where: { afiliadoId },
    });
    if (!afiliado) {
      throw new HttpException('Afiliado no encontrado', HttpStatus.NOT_FOUND);
    }
    afiliado.isActive = true;
    return this.afiliadosRepository.save(afiliado);
  }

  async deleteAfiliado(afiliadoId: number) {
    const afiliado = await this.afiliadosRepository.findOne({
      where: { afiliadoId },
    });
    if (!afiliado) {
      throw new HttpException('Afiliado no encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.afiliadosRepository.remove(afiliado);
  }

  // Permitir filtrar por afiliados activos o inactivos
  async getAfiliadosWithFilters(
    ubicacion?: string,
    genero?: string,
    actividades?: string,
    comercializa?: boolean,
    isActive?: boolean,
  ): Promise<Afiliado[]> {
    const queryBuilder =
      this.afiliadosRepository.createQueryBuilder('afiliado');

    if (isActive !== undefined) {
      queryBuilder.andWhere('afiliado.isActive = :isActive', { isActive });
    }
    if (ubicacion) {
      queryBuilder.andWhere('afiliado.direccion LIKE :ubicacion', {
        ubicacion: `%${ubicacion}%`,
      });
    }
    if (genero) {
      queryBuilder.andWhere('afiliado.genero = :genero', { genero });
    }
    if (actividades) {
      queryBuilder.andWhere('afiliado.actividadesAgricolas LIKE :actividades', {
        actividades: `%${actividades}%`,
      });
    }
    if (comercializa !== undefined) {
      queryBuilder.andWhere('afiliado.comercializacion = :comercializa', {
        comercializa,
      });
    }
    return await queryBuilder.getMany();
  }

  async generarPDFafiliado(filtros: {
    ubicacion?: string;
    genero?: string;
    actividades?: string;
    comercializa?: boolean;
  }): Promise<Buffer> {
    const afiliados = await this.getAfiliadosWithFilters(
      filtros.ubicacion,
      filtros.genero,
      filtros.actividades,
      filtros.comercializa,
    );

    const totalAfiliados = afiliados.length;
    const afiliadosPorGenero = {
      masculino: afiliados.filter((a) => a.genero === 'M').length,
      femenino: afiliados.filter((a) => a.genero === 'F').length,
    };
    const actividadesAgricolas = this.calcularActividadesAgricolas(afiliados);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      // Configuración del documento con formato carta apaisado para más espacio horizontal
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape', // Formato apaisado para más espacio horizontal
        bufferPages: true,
        autoFirstPage: true,
        margins: { top: 36, left: 50, right: 50, bottom: 36 },
      });

      // Variables para encabezado y pie de página
      let pageNumber = 0;
      const totalPages = Math.ceil(afiliados.length / 15) + 1;

      // Configurar colores y estilos
      const colors = {
        primary: '#2c3e50', // Azul oscuro para encabezados
        secondary: '#3498db', // Azul claro para acentos
        light: '#ecf0f1', // Gris muy claro para fondos
        text: '#333333', // Casi negro para texto
        headerText: '#ffffff', // Blanco para texto en encabezados
        rowEven: '#f5f9fc', // Azul muy claro para filas pares
        rowOdd: '#ffffff', // Blanco para filas impares
        border: '#bdc3c7', // Gris medio para bordes
        highlight: '#e74c3c', // Rojo para destacados
      };

      // Función para dibujar el encabezado
      const drawHeader = () => {
        // Fondo con color sólido para el encabezado (sin degradado)
        doc.rect(50, 36, doc.page.width - 100, 50).fill(colors.primary);

        // Título con sombra sutil
        doc.font('Helvetica-Bold').fontSize(24).fillColor(colors.headerText);
        doc.text('Reporte de Afiliados', 0, 52, { align: 'center' });

        // Fecha y hora de generación
        const now = new Date();
        const dateFormatted = now.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const timeFormatted = now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });

        doc.fontSize(8).fillColor(colors.headerText);
        doc.text(
          `Generado: ${dateFormatted} ${timeFormatted}`,
          doc.page.width - 150,
          36 + 8,
        );
      };

      // Función para dibujar el pie de página
      const drawFooter = () => {
        const footerTop = doc.page.height - 36;

        // Línea separadora con color sólido (sin degradado)
        doc
          .rect(50, footerTop - 15, doc.page.width - 100, 1)
          .fill(colors.primary);

        // Información de página
        doc.font('Helvetica').fontSize(8).fillColor(colors.primary);
        doc.text(
          `Página ${pageNumber} de ${totalPages}`,
          0.5 * (doc.page.width - 100),
          footerTop - 10,
          { width: 100, align: 'center', lineBreak: false },
        );
      };

      // Configurar eventos de página
      doc.on('pageAdded', () => {
        pageNumber++;
        drawHeader();
        drawFooter();
      });

      // Primera página
      pageNumber++;
      drawHeader();

      // Cuadro de resumen con efecto 3D sutil
      const summaryTop = 105;

      // Sombra para efecto 3D
      doc.rect(52, summaryTop + 2, doc.page.width - 104, 85).fill('#00000015');

      // Cuadro principal con borde redondeado
      doc
        .roundedRect(50, summaryTop, doc.page.width - 100, 85, 5)
        .fillAndStroke(colors.light, colors.border);

      // Línea decorativa con color sólido (sin degradado)
      doc
        .rect(60, summaryTop + 30, doc.page.width - 120, 1)
        .fill(colors.primary);
      doc
        .rect(60, summaryTop + 65, doc.page.width - 120, 1)
        .fill(colors.primary);

      // Título del resumen con gradiente
      doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.primary);
      doc.text('RESUMEN', 70, summaryTop + 10);

      // Datos del resumen con mejor formato - En columnas
      doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.primary);
      doc.text('Total de Afiliados:', 70, summaryTop + 40);
      doc.font('Helvetica').fontSize(12).fillColor(colors.text);
      doc.text(totalAfiliados.toString(), 200, summaryTop + 40);

      doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.primary);
      doc.text('Masculinos:', 70, summaryTop + 75);
      doc.font('Helvetica').fontSize(12).fillColor(colors.text);
      doc.text(afiliadosPorGenero.masculino.toString(), 200, summaryTop + 75);

      doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.primary);
      doc.text('Femeninos:', 350, summaryTop + 40);
      doc.font('Helvetica').fontSize(12).fillColor(colors.text);
      doc.text(afiliadosPorGenero.femenino.toString(), 480, summaryTop + 40);

      // Actividades en otra fila con enfoque visual
      doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.primary);
      doc.text('Actividades más comunes:', 350, summaryTop + 75);
      doc.font('Helvetica').fontSize(11).fillColor(colors.text);
      doc.text(actividadesAgricolas, 520, summaryTop + 75, { width: 250 });

      // Espacio para la tabla
      const tableTop = summaryTop + 105;

      // Encabezado de tabla con color sólido (sin degradado)
      doc
        .roundedRect(50, tableTop, doc.page.width - 100, 30, 3)
        .fill(colors.primary);

      // Definición de columnas optimizada para formato apaisado
      const columns = [
        { id: 'num', header: '#', width: 30, align: 'center' },
        { id: 'nombre', header: 'Nombre Completo', width: 150, align: 'left' },
        { id: 'cedula', header: 'Cédula', width: 80, align: 'center' },
        { id: 'correo', header: 'Correo', width: 140, align: 'left' },
        { id: 'genero', header: 'Género', width: 50, align: 'center' },
        { id: 'telefono', header: 'Teléfono', width: 80, align: 'center' },
        { id: 'anno', header: 'Año Nac.', width: 70, align: 'center' },
        {
          id: 'comercializa',
          header: 'Comercializa',
          width: 90,
          align: 'center',
        },
      ];

      // Calcular posiciones de columnas
      let currentX = 50;
      const columnPositions = {};

      columns.forEach((col) => {
        columnPositions[col.id] = {
          x: currentX,
          width: col.width,
        };
        currentX += col.width;
      });

      // Dibujar encabezados de tabla
      doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.headerText);
      columns.forEach((col) => {
        doc.text(col.header, columnPositions[col.id].x + 5, tableTop + 10, {
          width: col.width - 10,
          align: col.align as any,
        });
      });

      // Función para dibujar líneas verticales en la tabla
      const drawVerticalLines = (y, height) => {
        doc.strokeColor(colors.border).lineWidth(0.5);

        let lineX = 50;
        columns.forEach((col) => {
          lineX += col.width;
          doc
            .moveTo(lineX, y)
            .lineTo(lineX, y + height)
            .stroke();
        });
      };

      // Dibujar las líneas verticales en el encabezado
      drawVerticalLines(tableTop, 30);

      // Dibujar filas de datos
      let rowY = tableTop + 30;
      const rowHeight = 28;

      afiliados.forEach((afiliado, index) => {
        // Fondo para filas alternadas
        const fillColor = index % 2 === 0 ? colors.rowEven : colors.rowOdd;
        doc.rect(50, rowY, doc.page.width - 100, rowHeight).fill(fillColor);

        // Líneas de separación horizontales
        doc.strokeColor(colors.border).lineWidth(0.5);
        doc
          .moveTo(50, rowY)
          .lineTo(doc.page.width - 50, rowY)
          .stroke();

        // Dibujar las líneas verticales
        drawVerticalLines(rowY, rowHeight);

        // Datos de la fila
        doc.font('Helvetica').fontSize(10).fillColor(colors.text);

        // Índice (#)
        doc.text(
          (index + 1).toString(),
          columnPositions['num'].x + 5,
          rowY + 9,
          { width: columns[0].width - 10, align: 'center' },
        );

        // Nombre Completo
        doc.text(
          afiliado.nombreCompleto || '',
          columnPositions['nombre'].x + 5,
          rowY + 9,
          { width: columns[1].width - 10, align: 'left' },
        );

        // Cédula
        doc.text(
          afiliado.cedula || '',
          columnPositions['cedula'].x + 5,
          rowY + 9,
          { width: columns[2].width - 10, align: 'center' },
        );

        // Correo
        doc.text(
          afiliado.correo || '',
          columnPositions['correo'].x + 5,
          rowY + 9,
          { width: columns[3].width - 10, align: 'left' },
        );

        // Género (con color negro igual que el resto del texto)
        doc.fillColor(colors.text);
        doc.text(
          afiliado.genero || '',
          columnPositions['genero'].x + 5,
          rowY + 9,
          { width: columns[4].width - 10, align: 'center' },
        );

        // Teléfono
        doc.fillColor(colors.text);
        doc.text(
          afiliado.telefono?.toString() || '',
          columnPositions['telefono'].x + 5,
          rowY + 9,
          { width: columns[5].width - 10, align: 'center' },
        );

        // Año Nacimiento
        doc.text(
          afiliado.annoNacimiento?.toString() || '',
          columnPositions['anno'].x + 5,
          rowY + 9,
          { width: columns[6].width - 10, align: 'center' },
        );

        // Comercializa (con color negro igual que el resto del texto)
        doc.fillColor(colors.text);
        doc.text(
          afiliado.comercializacion ? 'Sí' : 'No',
          columnPositions['comercializa'].x + 5,
          rowY + 9,
          { width: columns[7].width - 10, align: 'center' },
        );

        rowY += rowHeight;
      });

      // Línea final de la tabla
      doc.strokeColor(colors.border).lineWidth(0.5);
      doc
        .moveTo(50, rowY)
        .lineTo(doc.page.width - 50, rowY)
        .stroke();

      // Dibujar pie de página
      drawFooter();

      // Finalizar el documento
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

    afiliados.forEach((afiliado) => {
      const actividades = afiliado.actividadesAgricolas
        .split(',')
        .map((a) => a.trim());
      actividades.forEach((actividad) => {
        actividadesMap.set(actividad, (actividadesMap.get(actividad) || 0) + 1);
      });
    });

    return Array.from(actividadesMap.entries())
      .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
      .slice(0, 3) // Tomar las 3 actividades más comunes
      .map(([actividad]) => actividad)
      .join(', ');
  }
}
