import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'
import Identicon from '../../components/identicon'
import ETHQR from '../../components/eth-qr'
import ledger from '../../assets/images/ledger.png'
import metamask from '../../assets/images/metamask.png'
import mycrypto from '../../assets/images/mycrypto.png'
import parity from '../../assets/images/parity.png'
import jaxx from '../../assets/images/jaxx.png'

import './simple-bid.css'

class SimpleBid extends PureComponent {
  static propTypes = {
    // React Router
    match: PropTypes.shape({
      params: PropTypes.shape({ address: PropTypes.string }).isRequired
    }).isRequired,

    // Redux State
    IICOData: IICOSelectors.IICODataShape.isRequired,

    // Action Dispatchers
    fetchIICOData: PropTypes.func.isRequired,
    pollIICOData: PropTypes.func.isRequired,

    // State
    noWeb3: PropTypes.bool
  }

  static defaultProps = {
    // State
    noWeb3: false
  }

  componentDidMount() {
    const {
      match: { params: { address } },
      fetchIICOData,
      pollIICOData,
      noWeb3
    } = this.props

    if (!noWeb3) {
      fetchIICOData(address)
      this.pollIICODataInterval = setInterval(() => pollIICOData(address), 5000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollIICODataInterval)
  }

  render() {
    const { match: { params: { address } }, IICOData, noWeb3 } = this.props
    return (
      <div className="SimpleBid">
        {noWeb3 && (
          <p>
            In order to access the advanced functionalities of the Interactive
            Coin Offering, you need a Web3 enabled browser (like MetaMask or
            Parity).
          </p>
        )}
        <p>
          If you don't care about setting a personal cap on the amount raised
          for your bid, you can use any wallet software to send ETH directly to
          the contract address. This is equivalent to submitting a bid with the
          "No Personal Cap" checkbox checked on the interactive interface.
        </p>
        <p>
          The address you send from has to be whitelisted in the{' '}
          <a
            href={`https://kleros.io/kyc`}
            target="_blank"
            rel="noopener noreferrer"
          >
            KYC
          </a>{' '}
          and you need to <b>send at least 300,000 gas with the transaction.</b>
          <RenderIf
            resource={IICOData}
            loading={null}
            done={
              IICOData.data &&
              `
            Your current Web3 address has the KYC Level ${
              IICOData.data.inReinforcedWhitelist
                ? '"Reinforced (with ID)" which means you can contribute as much as you\'d like'
                : IICOData.data.inBaseWhitelist
                  ? `"Base (with no ID)" which means you can contribute less than or equal to ${
                      IICOData.data.maximumBaseContribution
                    } ETH`
                  : '"None" which means you can\'t contribute until you complete the KYC and are approved'
            }. Make sure
            you send the transaction from the correct address.
            `
            }
            failedLoading={null}
          />
        </p>
        <p>
          <b>
            DON'T SEND YOUR TRANSACTION FROM AN EXCHANGE OR YOUR FUNDS WILL BE
            LOST.
          </b>
        </p>
        {address && (
          <div className="SimpleBid-addressInfo">
            <b>Contract Address:</b>&nbsp;
            <a href={`https://etherscan.io/address/${address}`}>{address}</a>
            <div className="SimpleBid-addressInfo-blocks">
              <div>
                <b>Identicon:</b>
                <br />
                <br />
                <Identicon seed={address} />
              </div>
              <div>
                <b>QR Code:</b>
                <br />
                <br />
                <ETHQR to={address} />
              </div>
            </div>
          </div>
        )}
        <p>
          At the end of the sale, you will just need to send a 0 ETH transaction
          to the same contract in order to get your Tokens. We will contact you
          at the end of the sale with a reminder.
        </p>
        {noWeb3 && (
          <p>
            Otherwise, to look at contract data and place advanced bids, you can
            come back with a Web3 enabled browser.
          </p>
        )}
        <b>Recommended tools to send ethers:</b>
        <div className="SimpleBid-wallets">
          <div>
            <a href="https://www.ledgerwallet.com/apps/ethereum">
              <img
                className="SimpleBid-wallets-ledger"
                alt="ledger wallet"
                src={ledger}
              />
            </a>
          </div>
          <div>
            <a href="https://metamask.io">
              <img
                className="SimpleBid-wallets-metamask"
                alt="metamask"
                src={metamask}
              />
            </a>
          </div>
          <div>
            <a href="https://mycrypto.com">
              <img
                className="SimpleBid-wallets-mycrypto"
                alt="mycrypto"
                src={mycrypto}
              />
            </a>
          </div>
          <div>
            <a href="https://parity.io">
              <img
                className="SimpleBid-wallets-parity"
                alt="parity wallet"
                src={parity}
              />
            </a>
          </div>
          <div>
            <a href="https://jaxx.io/">
              <img className="SimpleBid-wallets-jaxx" alt="jaxx" src={jaxx} />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOData: state.IICO.IICOData
  }),
  {
    fetchIICOData: IICOActions.fetchIICOData,
    pollIICOData: IICOActions.pollIICOData
  }
)(SimpleBid)
