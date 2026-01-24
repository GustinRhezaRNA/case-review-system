/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignCaseDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
