import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrStringClass implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    return typeof text === 'number' || typeof text === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return '($value) must be number or string';
  }
}
/**
 *
 * @param validationOptions
 * @returns
 */
export function IsNumberOrString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'string-or-number',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNumberOrStringClass,
    });
  };
}
