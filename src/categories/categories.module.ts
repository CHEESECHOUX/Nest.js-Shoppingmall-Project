import { Module } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesController } from '@src/categories/categories.controller';
import { Category } from '@src/categories/entity/categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoriesService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
