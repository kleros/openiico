import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as IICOActions from '../../../../actions/iico'
import {
  SubmitBidForm,
  getSubmitBidFormIsInvalid,
  submitSubmitBidForm
} from '../submit-bid-form'
import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import Button from '../../../../components/button'

import './bids.css'

class Bids extends PureComponent {
  static propTypes = {
    // State
    address: PropTypes.string.isRequired,
    bids: PropTypes.arrayOf(
      PropTypes.shape({
        maxVal: PropTypes.number.isRequired,
        contrib: PropTypes.number.isRequired,
        bonus: PropTypes.number.isRequired,
        contributor: PropTypes.string.isRequired,
        withdrawn: PropTypes.bool.isRequired,
        redeemed: PropTypes.bool.isRequired
      }).isRequired
    ),

    // Action Dispatchers
    createIICOBid: PropTypes.func.isRequired,
    withdrawIICOBid: PropTypes.func.isRequired,

    // submitBidForm
    submitBidFormIsInvalid: PropTypes.bool.isRequired,
    submitSubmitBidForm: PropTypes.func.isRequired
  }

  handleSubmitBidFormSubmit = formData => {
    const { address, createIICOBid } = this.props
    createIICOBid(address, formData.amount, formData.personalCap)
  }

  render() {
    const { bids, submitBidFormIsInvalid, submitSubmitBidForm } = this.props

    console.log(bids)
    return (
      <div className="Bids">
        <h1>Your Bids</h1>
        <StatRow>
          <StatBlock
            value={<SubmitBidForm onSubmit={this.handleSubmitBidFormSubmit} />}
          />
          <StatBlock
            value={
              <Button
                onClick={submitSubmitBidForm}
                disabled={submitBidFormIsInvalid}
              >
                ADD
              </Button>
            }
            noFlex
          />
        </StatRow>
      </div>
    )
  }
}

export default connect(
  state => ({
    submitBidFormIsInvalid: getSubmitBidFormIsInvalid(state)
  }),
  {
    createIICOBid: IICOActions.createIICOBid,
    withdrawIICOBid: IICOActions.withdrawIICOBid,
    submitSubmitBidForm
  }
)(Bids)
