import Eth from 'ethjs'

import IICO from '../assets/contracts/IICO'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]

let eth
if (process.env.NODE_ENV === 'test')
  eth = new Eth(require('ganache-cli').provider())
else if (window.web3 && window.web3.currentProvider)
  eth = new Eth(window.web3.currentProvider)
else eth = new Eth.HttpProvider(ETHEREUM_PROVIDER)

const IICOContractFactory = eth.contract(IICO.abi) // TODO: Put this on NPM or load dynamically?

export { eth, IICOContractFactory }
