import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';

@ApiTags('OverdueDebts')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('OverdueDebts')
@ApiBasicAuth()
export class OverdueDebtsController {
  /** Затычка */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}
