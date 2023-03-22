import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrStringClass implements ValidatorConstraintInterface {
  validate(text: unknown) {
    return typeof text === 'number' || typeof text === 'string';
  }

  defaultMessage() {
    return '($value) must be number or string';
  }
}

export function IsNumberOrString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'string-or-number',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNumberOrStringClass,
    });
  };
}
