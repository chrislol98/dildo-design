export type KeyType = string | number | symbol;


export type ValidateFieldsErrors<FieldValue = any, FieldKey extends KeyType = string> =
  | Record<FieldKey, FieldValue>
  | undefined
  | null;