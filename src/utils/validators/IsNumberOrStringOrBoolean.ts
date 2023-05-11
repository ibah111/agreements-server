import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number-or-boolean' })
export class IsNumberOrStringOrBooleanClass
  implements ValidatorConstraintInterface
{
  validate(text: unknown) {
    return (
      typeof text === 'number' ||
      typeof text === 'string' ||
      typeof text === 'boolean' ||
      text === null
    );
  }
  defaultMessage() {
    return '($value) must be number or string or boolean';
  }
}
export function IsNumberOrStringOrBoolean(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'string-or-number-or-boolean',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNumberOrStringOrBooleanClass,
    });
  };
}
