export const required = name => v =>
  v === undefined ? `${name} is required.` : undefined
export const number = name => v =>
  Number.isNaN(Number(v)) ? `${name} must be a number.` : undefined
