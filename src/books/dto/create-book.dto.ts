import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    pages: number;
}
