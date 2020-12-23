export function isNull(value:any): boolean {
  return value === null || value === undefined;
}

export function isBoolean(value:any): boolean {
  return typeof value === 'boolean';
}
