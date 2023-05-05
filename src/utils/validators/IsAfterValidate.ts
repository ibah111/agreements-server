import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'callback-validate' })
export class IsAfterValidateClass implements ValidatorConstraintInterface {
  validate(value, validationArguments: ValidationArguments): boolean {
    const object = validationArguments.object;
    const [func1, func2] = (validationArguments.constraints || []) as [
      (object: object) => object,
      (object1: object, object2: object) => boolean,
    ];
    return func2?.(func1?.(object), value);
  }
  defaultMessage(): string {
    return 'Ошибка';
  }
}
export function CallbackValidate<K, T>(
  getter: (object: K) => T,
  validate: (object: T, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'callback-validate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [getter, validate],
      options: validationOptions,
      validator: IsAfterValidateClass,
    });
  };
}
