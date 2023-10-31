import { RulesProps } from './interface';
import { Schema, SchemaType } from 'b-validate';
export async function schemaValidate(field, value, _rules: RulesProps[], validateMessages) {
  const rules: RulesProps[] = [..._rules];
  let current = 0;

  return new Promise(async (resolve) => {
    const warning = [];
    const validate = async (rule: RulesProps) => {
      const next = () => {
        if (current < rules.length - 1) {
          current++;
          return validate(rules[current]);
        }

        return resolve({ error: null, warning });
      };

      if (!rule) {
        return next();
      }

      const _rule = { ...rule };
      if (!_rule.type && !_rule.validator) {
        _rule.type = 'string';
      }
      const schema = new Schema({ [field]: [_rule] } as SchemaType, {
        ignoreEmptyString: true,
        validateMessages,
      });

      schema.validate({ [field]: value }, (error) => {
        if (error) {
          if (rule.validateLevel === 'warning') {
            warning.push(error[field].message);
          } else {
            return resolve({
              error,
              warning,
            });
          }
        }
        return next();
      });
    };
    validate(rules[current]);
  });
}