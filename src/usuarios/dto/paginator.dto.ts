import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginatorDto {
    @IsNumber()
    @IsOptional() //Marcamos que sea opcional en caso de no necesitar enviarlo
    @Type(() => Number)
    page: number
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    perPage: number
    
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit: number

}