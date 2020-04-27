export function toBoolean(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return val === 'true' || val === 'on' || val === '';
  }
  if (typeof val === 'number') {
    return val === 1;
  }
  return !!val;
}