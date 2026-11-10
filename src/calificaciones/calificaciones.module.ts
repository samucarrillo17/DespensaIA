import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesService } from './calificaciones.service';
import { CalificacionesController } from './calificaciones.controller';
import { Calificacione } from './entities/calificacione.entity';
import { Receta } from '../recetas/entities/receta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacione, Receta])],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
})
export class CalificacionesModule {}
