import Eth from 'ethjs'

import { takeLatest, select, all, call } from 'redux-saga/effects'

import * as IICOActions from '../actions/iico'
import * as walletSelectors from '../reducers/wallet'
import { IICOContractFactory } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'

// Parsers
const parseBid = b => ({
  maxVal: b.maxVal[0].toNumber(),
  contrib: b.contrib[0].toNumber(),
  bonus: b.bonus[0].toNumber() / 1e9,
  contributor: b.contributor[0],
  withdrawn: b.withdrawn[0],
  redeemed: b.redeemed[0]
})

/**
 * Fetches an IICO's data.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The IICO's data.
 */
function* fetchIICOData({ payload: { address } }) {
  // TODO: Verify contract adheres to IICO standard.

  // Load contract
  const contract = IICOContractFactory.at(address)

  const d = yield all({
    // Token
    tokenContractAddress: call(contract.token),
    tokensForSale: call(contract.tokensForSale),

    // Times
    startTime: call(contract.startTime),
    endFullBonusTime: call(contract.endFullBonusTime),
    withdrawalLockTime: call(contract.withdrawalLockTime),
    endTime: call(contract.endTime),

    // Sale Data
    startingBonus: call(contract.maxBonus),
    bonus: call(contract.bonus),
    valuationAndAmountCommitted: call(contract.valuation)
  })

  return {
    // Token
    tokenContractAddress: d.tokenContractAddress[0],
    tokensForSale: d.tokensForSale[0].toNumber(),

    // Times
    startTime: new Date(d.startTime[0].toNumber() * 1000),
    endFullBonusTime: new Date(d.endFullBonusTime[0].toNumber() * 1000),
    withdrawalLockTime: new Date(d.withdrawalLockTime[0].toNumber() * 1000),
    endTime: new Date(d.endTime[0].toNumber() * 1000),

    // Sale Data
    startingBonus: d.startingBonus[0].toNumber() / 1e9,
    bonus: d.bonus[0].toNumber() / 1e9,
    valuation: d.valuationAndAmountCommitted[0].toNumber(),
    amountCommitted: d.valuationAndAmountCommitted[1].toNumber(),
    virtualValuation: d.valuationAndAmountCommitted[0].toNumber()
  }
}

// Helpers
/**
 * Fetches an address's bid IDs.
 * @param {object} contract - The contract instance object.
 * @param {string} account - The account.
 * @returns {string[]} - The bid IDs.
 */
function* fetchBidIDs(contract, account) {
  const bidIDs = []
  let i = 0

  while (true) {
    const bidID = (yield call(
      contract.contributorBidIDs,
      account,
      i
    ))[0].toNumber()

    if (bidID === 0) break

    bidIDs.push(bidID)
    i++
  }

  return bidIDs
}

// Sagas
/**
 * Fetches the current wallet's IICO bids.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The current wallet's IICO bids.
 */
function* fetchIICOBids({ payload: { address } }) {
  // Load contract
  const contract = IICOContractFactory.at(address)

  // Get bid IDs
  const bidIDs = yield call(
    fetchBidIDs,
    contract,
    yield select(walletSelectors.getAccount)
  )

  return (yield all(bidIDs.map(bidID => call(contract.bids, bidID)))).map(
    parseBid
  )
}

/**
 * Creates an IICO bid.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The `lessdux` collection mod object for updating the list of bids.
 */
function* createIICOBid({
  payload: { address, amount: _amount, personalCap: _personalCap }
}) {
  // Load contract
  const contract = IICOContractFactory.at(address)
  const account = yield select(walletSelectors.getAccount)

  const amount = Eth.toWei(_amount, 'ether')
  const personalCap = Eth.toWei(_personalCap, 'ether')

  const nextBidID = (yield call(contract.search, personalCap, 0))[0]

  yield call(contract.searchAndBid, personalCap, nextBidID, {
    from: account,
    value: amount
  })

  // Get the ID
  const bidIDs = yield call(fetchBidIDs, contract, account)
  const lastBidID = bidIDs[bidIDs.length - 1]

  return {
    collection: IICOActions.IICOBids.self,
    resource: parseBid(yield call(contract.bids, lastBidID))
  }
}

/**
 * Withdraws an IICO bid.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The `lessdux` collection mod object for updating the list of bids.
 */
function* withdrawIICOBid({ payload: { address, contributorBidID } }) {
  // Load contract
  const contract = IICOContractFactory.at(address)

  // Get the ID
  const bidID = (yield call(
    fetchBidIDs,
    contract,
    yield select(walletSelectors.getAccount)
  ))[contributorBidID]

  yield call(contract.withdraw, bidID)

  return {
    collection: IICOActions.IICOBids.self,
    resource: parseBid(yield call(contract.bids, bidID))
  }
}

/**
 * The root of the IICO saga.
 */
export default function* IICOSaga() {
  // IICO Data
  yield takeLatest(
    IICOActions.IICOData.FETCH,
    lessduxSaga,
    'fetch',
    IICOActions.IICOData,
    fetchIICOData
  )

  // IICO Bids
  yield takeLatest(
    IICOActions.IICOBids.FETCH,
    lessduxSaga,
    'fetch',
    IICOActions.IICOBids,
    fetchIICOBids
  )

  // IICO Bid
  yield takeLatest(
    IICOActions.IICOBid.CREATE,
    lessduxSaga,
    'create',
    IICOActions.IICOBid,
    createIICOBid
  )
  yield takeLatest(
    IICOActions.IICOBid.WITHDRAW,
    lessduxSaga,
    'update',
    IICOActions.IICOBid,
    withdrawIICOBid
  )
}
