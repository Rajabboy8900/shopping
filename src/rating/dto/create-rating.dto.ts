import { IsNumber, IsUUID, Max, Min } from "class-validator";

export class CreateRatingDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    value: number;

    @IsUUID()
    productId: string;
}
