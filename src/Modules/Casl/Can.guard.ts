import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthResult } from '../Guards/auth.guard';
import { CHECK_POLICIES_KEY } from './Can.decorators';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { CanHandler } from './Casl.policy';
@Injectable()
export class CanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const canHandlers = this.reflector.get<CanHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );
    const body: { user: AuthResult } = context.switchToHttp().getRequest();
    const user = body.user.userLocal;
    const ability = this.caslAbilityFactory.createForUser(user);
    return canHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }
  private execPolicyHandler(handler: CanHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
