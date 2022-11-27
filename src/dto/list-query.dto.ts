import { IsBoolean, IsDate, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean, toLowerCase, toNumber, trim, toDate, toPagination, toCrudSorting, toCrudFilters } from '../helper/cast.helper';
import { Pagination } from './pagination.dto';
import { CrudSorting } from './crud-sorting.dto';
import { CrudFilters } from './crud-filters.dto';

export class ListQueryDto {
    @Transform(({value}) => toBoolean(value))
    @IsOptional()
    @IsBoolean()
    public hasPagination: boolean;

    @Transform(({value}) => toPagination(value))
    @IsOptional()
    public pagination: Pagination;

    @Transform(({value}) => toCrudSorting(value))
    @IsOptional()
    public sort: CrudSorting[];

    @Transform(({value}) => toCrudFilters(value))
    @IsOptional()
    public filters: CrudFilters[];
}