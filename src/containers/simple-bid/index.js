import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'
import ChainHash from '../../components/chain-hash'
import Identicon from '../../components/identicon'
import ETHQR from '../../components/eth-qr'

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
    const { match: { params: { address } }, IICOData } = this.props
    return (
      <div className="SimpleBid">
        <p>
          To participate in the Kleros token sale, send ETH to the address
          below.
        </p>
        <p>
          The address you send from has to be whitelisted in the{' '}
          {process.env.REACT_APP_BRANCH === 'master' ? (
            <a
              href={`https://kleros.io/kyc`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>KYC</b>
            </a>
          ) : (
            'KYC'
          )}{' '}
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
        <div className="SimpleBid-warning">
          <FontAwesomeIcon
            icon="exclamation-circle"
            className="SimpleBid-warning-icon"
          />
          <div>
            DON'T SEND YOUR TRANSACTION FROM AN EXCHANGE OR YOUR FUNDS WILL BE
            LOST.
          </div>
        </div>
        {address && (
          <div className="SimpleBid-addressInfo">
            <b>Contract Address:</b>
            <div className="SimpleBid-addressInfo-address">
              <ChainHash full>{address}</ChainHash>
            </div>
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
