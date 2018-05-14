import Eth from 'ethjs'
import { getChecksumAddress } from 'ethjs-account'

import { takeLatest, select, all, call, put } from 'redux-saga/effects'

import * as IICOActions from '../actions/iico'
import * as walletSelectors from '../reducers/wallet'
import { eth, IICOContractFactory } from '../bootstrap/dapp-api'
import { lessduxSaga, sendTransaction } from '../utils/saga'
import { action } from '../utils/action'

// Parsers
const parseBid = (b, ID) => ({
  ID,
  maxValuation: Number(Eth.fromWei(b.maxValuation, 'ether')),
  contrib: Number(Eth.fromWei(b.contrib, 'ether')),
  bonus: b.bonus.toNumber() / 1e9,
  contributor: b.contributor,
  withdrawn: b.withdrawn,
  redeemed: b.redeemed
})

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
 * Fetches an IICO's data.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The IICO's data.
 */
function* fetchIICOData({ payload: { address } }) {
  // TODO: Verify contract adheres to IICO standard.

  // Load contract
  const contract = IICOContractFactory.at(address)
  const account = yield select(walletSelectors.getAccount)

  const d = yield all({
    // Centralized
    ethTicker: call(() =>
      fetch('https://api.coinmarketcap.com/v2/ticker/1027/')
        .then(res => res.json())
        .catch(err => console.error(err))
    ),

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
    valuationAndCutOff: call(contract.valuationAndCutOff),
    finalized: call(contract.finalized),

    // Optional Whitelist
    maximumBaseContribution: call(contract.maximumBaseContribution),
    inBaseWhitelist: call(contract.baseWhitelist, account),
    inReinforcedWhitelist: call(contract.reinforcedWhitelist, account)
  })

  let tokenContractAddress
  try {
    tokenContractAddress = getChecksumAddress(d.tokenContractAddress[0])
  } catch (err) {
    console.error(err)
    throw new Error()
  }

  return {
    address,

    // Centralized
    ethPrice: d.ethTicker && d.ethTicker.data.quotes.USD.price,

    // Token
    tokenContractAddress,
    tokensForSale: Number(Eth.fromWei(d.tokensForSale[0], 'ether')),

    // Times
    startTime: new Date(d.startTime[0].toNumber() * 1000),
    endFullBonusTime: new Date(d.endFullBonusTime[0].toNumber() * 1000),
    withdrawalLockTime: new Date(d.withdrawalLockTime[0].toNumber() * 1000),
    endTime: new Date(d.endTime[0].toNumber() * 1000),

    // Sale Data
    startingBonus: d.startingBonus[0].toNumber() / 1e9,
    bonus: d.bonus[0].toNumber() / 1e9,
    valuation: Number(Eth.fromWei(d.valuationAndCutOff[0], 'ether')),
    virtualValuation: Number(Eth.fromWei(d.valuationAndCutOff[1], 'ether')),
    cutOffBidID: d.valuationAndCutOff[2].toNumber(),
    cutOffBidMaxValuation: Number(
      Eth.fromWei(d.valuationAndCutOff[3], 'ether')
    ),
    cutOffBidContrib: Number(Eth.fromWei(d.valuationAndCutOff[4], 'ether')),
    finalized: d.finalized[0],

    // Optional Whitelist
    maximumBaseContribution: Number(
      Eth.fromWei(d.maximumBaseContribution[0], 'ether')
    ),
    inBaseWhitelist: d.inBaseWhitelist[0],
    inReinforcedWhitelist: d.inReinforcedWhitelist[0]
  }
}

/**
 * Attempts to finalize an IICO.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The IICO's updated data.
 */
function* finalizeIICOData({ payload: { address, maxIterations } }) {
  // Load contract
  const contract = IICOContractFactory.at(address)

  yield call(sendTransaction, contract.finalize, maxIterations, {
    from: yield select(walletSelectors.getAccount)
  })

  return yield call(fetchIICOData, { payload: { address } })
}

/**
 * Refetches an IICO's data.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 */
function* pollIICOData({ payload: { address } }) {
  yield put(
    action(IICOActions.IICOData.RECEIVE, {
      IICOData: yield call(fetchIICOData, { payload: { address } })
    })
  )
}

/**
 * Fetches the current wallet's IICO bids.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object[]} - The current wallet's IICO bids.
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
    (b, index) => parseBid(b, bidIDs[index])
  )
}

/**
 * Redeems the current wallet's IICO bids.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object[]} - The current wallet's updated IICO bids.
 */
function* redeemIICOBids({ payload: { address } }) {
  yield call(sendTransaction, eth.sendTransaction, {
    from: yield select(walletSelectors.getAccount),
    to: address,
    value: 0,
    data: '0x'
  })

  return yield call(fetchIICOBids, { payload: { address } })
}

/**
 * Creates an IICO bid.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The `lessdux` collection mod object for updating the list of bids.
 */
function* createIICOBid({
  payload: {
    address,
    amount: _amount,
    personalCap: _personalCap,
    noPersonalCap
  }
}) {
  // Load contract
  const contract = IICOContractFactory.at(address)
  const account = yield select(walletSelectors.getAccount)

  const amount = Eth.toWei(_amount, 'ether')
  const personalCap = noPersonalCap ? -2 : Eth.toWei(_personalCap, 'ether')

  const nextBidID = (yield call(contract.search, personalCap, 0))[0]

  yield call(sendTransaction, contract.searchAndBid, personalCap, nextBidID, {
    from: account,
    value: amount
  })

  // Update IICO data for pricing info
  yield put(
    action(IICOActions.IICOData.RECEIVE, {
      IICOData: yield call(fetchIICOData, { payload: { address } })
    })
  )

  // Get the ID
  const bidIDs = yield call(fetchBidIDs, contract, account)
  const lastBidID = bidIDs[bidIDs.length - 1]

  return {
    collection: IICOActions.IICOBids.self,
    resource: parseBid(yield call(contract.bids, lastBidID), lastBidID)
  }
}

/**
 * Withdraws or redeems an IICO bid.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The `lessdux` collection mod object for updating the list of bids.
 */
function* withdrawOrRedeemIICOBid({ type, payload: { address, bidID } }) {
  try {
    // Set collection mod for granular loading indicators
    yield put(
      action(IICOActions.IICOBid.UPDATE, {
        collectionMod: {
          collection: IICOActions.IICOBids.self,
          updating: [bidID]
        }
      })
    )

    // Load contract
    const contract = IICOContractFactory.at(address)
    const account = yield select(walletSelectors.getAccount)

    yield call(
      sendTransaction,
      contract[type === IICOActions.IICOBid.WITHDRAW ? 'withdraw' : 'redeem'],
      bidID,
      { from: account }
    )

    // Update IICO data for pricing info
    yield put(
      action(IICOActions.IICOData.RECEIVE, {
        IICOData: yield call(fetchIICOData, { payload: { address } })
      })
    )

    return {
      collection: IICOActions.IICOBids.self,
      resource: parseBid(yield call(contract.bids, bidID), bidID),
      find: b => b.ID === bidID,
      updating: bidID
    }
  } catch (err) {
    // Remove collection mod for granular loading indicators if something fails
    yield put(
      action(IICOActions.IICOBid.FAIL_UPDATE, {
        collectionMod: {
          collection: IICOActions.IICOBids.self,
          updating: bidID
        }
      })
    )
    throw err
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
  yield takeLatest(
    IICOActions.IICOData.FINALIZE,
    lessduxSaga,
    'update',
    IICOActions.IICOData,
    finalizeIICOData
  )
  yield takeLatest(IICOActions.IICOData.POLL, pollIICOData)

  // IICO Bids
  yield takeLatest(
    IICOActions.IICOBids.FETCH,
    lessduxSaga,
    'fetch',
    IICOActions.IICOBids,
    fetchIICOBids
  )
  yield takeLatest(
    IICOActions.IICOBids.REDEEM,
    lessduxSaga,
    'update',
    IICOActions.IICOBids,
    redeemIICOBids
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
    withdrawOrRedeemIICOBid
  )
  yield takeLatest(
    IICOActions.IICOBid.REDEEM,
    lessduxSaga,
    'update',
    IICOActions.IICOBid,
    withdrawOrRedeemIICOBid
  )
}
