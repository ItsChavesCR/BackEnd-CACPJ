/* eslint-disable prettier/prettier */
import {Module} from '@nestjs/common';
import { AfiliadosModule } from './afiliados/afiliados.module';
import { GanaderiaModule } from './ganaderia/ganaderia.module';
import { PsaModule } from './psa/psa.module';
import { CreditoModule } from './credito/credito.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Afiliado } from './afiliados/entities/afiliados.entity';
import { Ganaderia } from './ganaderia/entities/ganaderia.entity';
import { Credito } from './credito/entities/credito.entity';
import { Psa } from './psa/entities/psa.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'root',
      port: 3306,
      username: '',
      password: '',
      database: '',
      entities: [Afiliado, Credito, Ganaderia, Psa],
      synchronize: true
    }),
    AfiliadosModule, 
    GanaderiaModule, 
    PsaModule, 
    CreditoModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
