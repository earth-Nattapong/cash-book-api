import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { PaginationRequest, SearchContext } from '../../../common/dto';

export class UserSearchRequest {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SearchContext)
  context: SearchContext;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationRequest)
  pagination: PaginationRequest;
}
