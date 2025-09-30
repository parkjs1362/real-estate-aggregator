import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

export class SearchComplexDto {
  @ApiPropertyOptional({
    description: '검색어 (단지명, 주소)',
    example: '래미안',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: '지역 코드 (시도 또는 구군)',
    example: '11',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: '결과 개수 제한',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class GetComplexesDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '시도 코드',
    example: '11',
  })
  @IsOptional()
  @IsString()
  sido?: string;

  @ApiPropertyOptional({
    description: '구군 코드',
    example: '11110',
  })
  @IsOptional()
  @IsString()
  gugun?: string;

  @ApiPropertyOptional({
    description: '동 코드',
    example: '1111010500',
  })
  @IsOptional()
  @IsString()
  dong?: string;

  @ApiPropertyOptional({
    description: '최소 건축년도',
    example: 2010,
    minimum: 1970,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1970)
  buildYearMin?: number;

  @ApiPropertyOptional({
    description: '최대 건축년도',
    example: 2025,
    maximum: 2030,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(2030)
  buildYearMax?: number;

  @ApiPropertyOptional({
    description: '정렬 기준',
    example: 'name',
    enum: ['name', 'buildYear', 'totalCount', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'buildYear', 'totalCount', 'createdAt'])
  sortBy?: string = 'name';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}