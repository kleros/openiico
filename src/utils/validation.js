// General
export const required = name => v =>
  v === undefined ? `${name} is required.` : undefined

// Number
export const number = name => v =>
  Number.isNaN(Number(v)) ? `${name} must be a number.` : undefined
export const positive = name => v =>
  Number(v) < 0 ? `${name} must be a positive number.` : undefined
export const nonZero = name => v =>
  Number(v) === 0 ? `${name} can't be zero.` : undefined
