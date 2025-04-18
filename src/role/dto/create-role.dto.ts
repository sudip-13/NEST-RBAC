import { IsArray, IsString } from 'class-validator';
export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  permissions: number[];
}
