const prompt = require('prompt')
const colors = require('colors/safe')
const Eth = require('ethjs')
const SignerProvider = require('ethjs-provider-signer')
const sign = require('ethjs-signer').sign

const _Pinakion = require('../assets/contracts/Pinakion')
const _IICO = require('../assets/contracts/IICO')

const pubKey = '0x98a3A786F2cAa319Dc234d28fcd6e362A9750709'
const privateKey =
  '0x1d13731d12d63d92e2b2205779222468e33383887fe9dbf0eaf3aee97fcc3845'
const infuraURL = 'https://kovan.infura.io/Se0Wcwnp9fHQ5V6N64B6'

prompt.message = colors.rainbow('IICO Sale Set Up')
prompt.delimiter = colors.rainbow(' >>> ')
prompt.start()
prompt.get(
  [
    {
      name: 'pinakionContract',
      description: 'Pinakion Contract (address)',
      type: 'string',
      default: '0x08daa0c630bf42c1e4bc1d4756c2bd6b79cb311c'
    },
    {
      name: 'tokensForSale',
      description: 'Tokens for Sale (ETH)',
      type: 'number',
      default: 0.16 * 1e9
    },
    {
      name: 'startTime',
      description: 'Start Time (seconds)',
      type: 'number',
      default: Date.now() / 1000 + 180
    },
    {
      name: 'fullBonusLength',
      description: 'Full Bonus Length (seconds)',
      type: 'number',
      default: 300
    },
    {
      name: 'partialWithdrawalLength',
      description: 'Partial Withdrawal Length (seconds)',
      type: 'number',
      default: 300
    },
    {
      name: 'withdrawalLockUpLength',
      description: 'Withdrawal Lock Up Length (seconds)',
      type: 'number',
      default: 300
    },
    {
      name: 'maxBonus',
      description: 'Max Bonus (X/1e15)',
      type: 'number',
      default: 2e8
    },
    {
      name: 'beneficiary',
      description: 'Beneficiary (address)',
      type: 'string',
      default: '0x98a3A786F2cAa319Dc234d28fcd6e362A9750709'
    },
    {
      name: 'maximumBaseContribution',
      description: 'Maximum Base Contribution (ETH)',
      type: 'number',
      default: 5
    },
    {
      name: 'baseWhitelistAddresses',
      description: 'Base Whitelist Addresses (address[])',
      type: 'array'
    },
    {
      name: 'reinforcedWhitelistAddresses',
      description: 'Reinforced Whitelist Addresses (address[])',
      type: 'array'
    }
  ],
  async (
    err,
    {
      pinakionContract: _pinakionContract,
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
    }
  ) => {
    if (err) throw err
    const pinakionContract =
      _pinakionContract === ' ' ? undefined : _pinakionContract

    // Set up Web3 and contract factories
    const eth = new Eth(
      new SignerProvider(infuraURL, {
        signTransaction: (rawTransaction, callback) =>
          callback(null, sign(rawTransaction, privateKey)),
        accounts: callback => callback(null, [pubKey])
      })
    )
    const sendTransaction = async (transaction, ...args) => {
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
    const defaultTransactionObject = {
      from: pubKey,
      gas: 3000000
    }
    const PinakionContractFactory = eth.contract(
      _Pinakion.abi,
      _Pinakion.bytecode,
      defaultTransactionObject
    )
    const IICOContractFactory = eth.contract(
      _IICO.abi,
      _IICO.bytecode,
      defaultTransactionObject
    )

    // Get and/or deploy contracts
    const [Pinakion, IICO] = await Promise.all([
      pinakionContract
        ? PinakionContractFactory.at(pinakionContract)
        : sendTransaction(PinakionContractFactory.new).then(receipt =>
            PinakionContractFactory.at(receipt.contractAddress)
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

    // Mint and set up tokens
    await sendTransaction(
      Pinakion.mint,
      IICO.address,
      Eth.toWei(tokensForSale, 'ether')
    )
    await sendTransaction(IICO.setToken, Pinakion.address)

    // Add addresses to whitelists
    await Promise.all([
      baseWhitelistAddresses &&
        sendTransaction(IICO.addBaseWhitelist, baseWhitelistAddresses),
      reinforcedWhitelistAddresses &&
        sendTransaction(
          IICO.addReinforcedWhitelist,
          reinforcedWhitelistAddresses
        )
    ])

    console.log('Pinakion Contract Address: ', Pinakion.address)
    console.log('IICO Contract Address: ', IICO.address)
  }
)
