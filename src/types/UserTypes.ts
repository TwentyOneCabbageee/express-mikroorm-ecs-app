import { IsNotEmpty, IsString, IsDateString, IsDate, IsOptional } from 'class-validator';

export class GetUserRequestType {
    @IsNotEmpty()
    @IsString()
    userId!: string
}

export interface GetUserResponseType{
    name: string;
    birthdate: string;
    location: string;
}

export class CreateUserRequestType {
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsDateString()
    birthdate!: Date;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    timezone!: string;
}

export class UpdateUserRequestType {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    birthdate?: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    timezone?: string;
}

