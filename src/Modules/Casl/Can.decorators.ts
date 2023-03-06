import { SetMetadata } from '@nestjs/common';
import { CanHandler } from './Casl.policy';

export const CHECK_POLICIES_KEY = 'check_can';
export const CheckCan = (...handlers: CanHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
