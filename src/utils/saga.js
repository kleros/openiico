import React from 'react'
import { delay } from 'redux-saga'
import { toastr } from 'react-redux-toastr'

import { call, put } from 'redux-saga/effects'

import { eth } from '../bootstrap/dapp-api'
import * as walletActions from '../actions/wallet'
import ChainHash from '../components/chain-hash'

import { action as _action, errorAction } from './action'

/**
 * Calls a saga with the `lessdux` flow.
 * @param {string} flow - The `lessdux` flow that should be used, (create, fetch, update, delete).
 * @param {object} resourceActions - The `lessdux` resource actions object.
 * @param {object} saga - The saga being called.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object that triggered the saga.
 */
export function* lessduxSaga(flow, resourceActions, saga, action) {
  let receiveWord
  let failWord
  switch (flow) {
    case 'create':
      receiveWord = '_CREATED'
      failWord = '_CREATE'
      break
    case 'fetch':
      receiveWord = ''
      failWord = '_FETCH'
      break
    case 'update':
      receiveWord = '_UPDATED'
      failWord = '_UPDATE'
      yield put(_action(resourceActions.UPDATE)) // Updates are not called directly so call it here to set .updating on the resource
      break
    case 'delete':
      receiveWord = '_DELETED'
      failWord = '_DELETE'
      break
    default:
      throw new TypeError('Invalid lessdux flow.')
  }

  try {
    const result = yield call(saga, action)

    yield put(
      _action(resourceActions['RECEIVE' + receiveWord], {
        [result.collection ? 'collectionMod' : resourceActions.self]: result
      })
    )
  } catch (err) {
    toastr.error('', err.message.slice(0, 100))
    yield put(errorAction(resourceActions['FAIL' + failWord], err))
  }
}

/**
 * Sends a transaction, waits for it to be mined, and updates the ETH balance.
 * @param {function} contractFunction - The transaction function to call.
 * @param {...any} args - The arguments to pass into the contractFunction.
 * @returns {object} - The transaction receipt object.
 */
export function* sendTransaction(contractFunction, ...args) {
  // Send transaction
  const hash = yield call(contractFunction, ...args)

  // Wait for receipt
  let receipt
  while (!receipt) {
    receipt = yield call(eth.getTransactionReceipt, hash)
    yield call(delay, 200)
  }

  // Refetch balance
  yield put(_action(walletActions.balance.FETCH))

  // Check for failures
  if (receipt.status === '0x0') throw new Error('Transaction failed.')

  // Show success message
  toastr.success('', '', {
    timeOut: 0,
    component: () => (
      <div>
        Your transaction with hash{' '}
        <ChainHash>{receipt.transactionHash}</ChainHash> was completed
        succesfully.
      </div>
    )
  })

  // Return receipt
  return receipt
}
