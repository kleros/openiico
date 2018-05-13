import { ETHAddressRegExp } from '../bootstrap/dapp-api'

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

// Ethereum
export const isETHAddress = name => v =>
  !ETHAddressRegExp.test(v) || v.length !== 42
    ? `${name} must be a valid address.`
    : undefined
