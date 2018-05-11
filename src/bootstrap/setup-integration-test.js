import React from 'react'
import { mount } from 'enzyme'
import Eth from 'ethjs'

import _Token from '../assets/contracts/Token'
import _IICO from '../assets/contracts/IICO'

import configureStore from './configure-store'
import App from './app'
import { eth } from './dapp-api'

const mockETHAddress = '0x0000000000000000000000000000000000000000'

/**
 * Send a transaction and wait for it to be mined.
 * @param {function} transaction - The transaction function.
 * @param {...any} args - The parameters for the transaction.
 * @returns {object} - The transaction receipt object.
 */
export async function sendTransaction(transaction, ...args) {
  // Send transaction
  const hash = await transaction(...args)

  // Wait for receipt
  let receipt
  while (!receipt) {
    receipt = await eth.getTransactionReceipt(hash)
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Return receipt
  return receipt
}

/**
 * Sets up the contracts used in a sale.
 * @param {number} tokensForSale - The amount of tokens that will be sold.
 * @param {number} startTime - The UNIX Epoch time in seconds on which the sale will start.
 * @param {number} fullBonusLength - The length of the full bonus phase in seconds.
 * @param {number} partialWithdrawalLength - The length of the partial withdrawals phase in seconds.
 * @param {number} withdrawalLockUpLength - The length of the withdrawal lock-up phase in seconds.
 * @param {number} maxBonus - The maximum/starting bonus for the sale.
 * @param {string} beneficiary - The address that receives the ETH from contributions at the end of the sale.
 * @param {number} maximumBaseContribution - The maximum contribution from an address that has only passed the base KYC.
 * @param {string[]} baseWhitelistAddresses - The addresses to add to the base KYC whitelist.
 * @param {string[]} reinforcedWhitelistAddresses - The addresses to add to the reinforced KYC whitelist.
 * @returns {{ Token: object, IICO: object }} - The Token and IICO contract instances.
 */
export async function setUpContracts(
  tokensForSale,
  startTime,
  fullBonusLength,
  partialWithdrawalLength,
  withdrawalLockUpLength,
  maxBonus,
  beneficiary,
  maximumBaseContribution,
  baseWhitelistAddresses,
  reinforcedWhitelistAddresses
) {
  // Get public key of main account
  const pubKey = (await eth.accounts())[0]

  // Set up contract factories
  const defaultTransactionObject = {
    from: pubKey,
    data: '',
    gas: 3000000
  }
  const TokenContractFactory = eth.contract(
    _Token.abi,
    _Token.bytecode,
    defaultTransactionObject
  )
  const IICOContractFactory = eth.contract(
    _IICO.abi,
    _IICO.bytecode,
    defaultTransactionObject
  )

  // Deploy contracts
  const [Token, IICO] = await Promise.all([
    sendTransaction(TokenContractFactory.new).then(receipt =>
      TokenContractFactory.at(receipt.contractAddress)
    ),
    sendTransaction(
      IICOContractFactory.new,
      startTime,
      fullBonusLength,
      partialWithdrawalLength,
      withdrawalLockUpLength,
      maxBonus,
      beneficiary,
      Eth.toWei(maximumBaseContribution, 'ether')
    ).then(receipt => IICOContractFactory.at(receipt.contractAddress))
  ])

  // Mint and set up token
  await sendTransaction(
    Token.mint,
    IICO.address,
    Eth.toWei(tokensForSale, 'ether')
  )
  await sendTransaction(IICO.setToken, Token.address)

  // Set up whitelists
  await sendTransaction(IICO.setWhitelister, pubKey)
  await Promise.all([
    baseWhitelistAddresses.length &&
      sendTransaction(IICO.addBaseWhitelist, baseWhitelistAddresses),
    reinforcedWhitelistAddresses.length &&
      sendTransaction(IICO.addReinforcedWhitelist, reinforcedWhitelistAddresses)
  ])

  return { Token, IICO }
}

/**
 * Wait for all promises to resolve in a test environment and update the app.
 * @param {object} app - The app wrapper to update.
 * @returns {Promise<number>} - A promise that resolves when the timeout handler is called.
 */
export function flushPromises(app) {
  return new Promise(resolve =>
    setTimeout(() => {
      app.update()
      resolve()
    }, 1000)
  )
}

/**
 * Sets up an integration test environment.
 * @param {object} [initialState={}] - The initial state.
 * @returns {{ store: object, history: object, dispatchSpy: function, mountApp: function, contracts: { Token: object, IICO: object } }} - Utilities for testing.
 */
export default async function setupIntegrationTest(initialState = {}) {
  const dispatchSpy = jest.fn(() => ({}))
  const { store, history } = configureStore(initialState, {
    dispatchSpy
  })
  const mountApp = testElement =>
    mount(<App store={store} history={history} testElement={testElement} />)

  const { Token, IICO } = await setUpContracts(
    0.16 * 1e9,
    Date.now() / 1000 + 180, // Now + 3 minutes
    300,
    300,
    300,
    2e8,
    mockETHAddress,
    5,
    [],
    []
  )

  return { store, history, dispatchSpy, mountApp, contracts: { Token, IICO } }
}
