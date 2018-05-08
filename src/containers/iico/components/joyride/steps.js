import React from 'react'

export default [
  {
    title: 'Welcome to the Interactive Coin Offering.',
    text: (
      <span>
        Get started with the tutorial or skip it if you already know what you
        are doing.
        <br />
        <br />
        First, let’s go over the sale’s main data points and explain what they
        are. A full explanation can be found{' '}
        <a
          href="https://medium.com/kleros/how-interactive-coin-offerings-iicos-work-beed401ce526"
          rel="noopener noreferrer"
          target="_blank"
        >
          here
        </a>.
        <br />
        <br />
        Keep in mind that everything you do in the tutorial is virtual and does
        not create any transactions.
      </span>
    ),
    selector: '#joyrideWelcome'
  },
  {
    text: (
      <span>
        This is the ICO’s contract address.
        <br />
        <br />
        You can hover over it to see it in full and you can click on it to
        explore the contract on etherscan. Try doing that now.
      </span>
    ),
    selector: '#joyrideTokenContractAddress'
  },
  {
    text: (
      <span>
        This is the amount of tokens that are up for sale.
        <br />
        <br />
        They will be distributed proportionally across all bidders relative to
        the size of their contributions and bonuses.
      </span>
    ),
    selector: '#joyrideTokensForSale'
  },
  {
    text: (
      <span>
        This is the sale’s current valuation.
        <br />
        <br />
        That is, if the sale were to end now and personal caps were taken into
        account to see which ones should be refunded.
        <br />
        <br />
        The number is truncated to two significant digits, but you can hover
        over it to see it in full.
      </span>
    ),
    selector: '#joyrideValuation'
  },
  {
    text: (
      <span>
        This is the sale’s current phase. There are four phases and the actions
        you can take are different in each one.
        <br />
        <br />
        <b>Not Started:</b> The sale has not started yet at this point, so there
        is nothing you can do.
        <br />
        <br />
        <b>Full Bonus:</b> You may place bids that take advantage of the whole
        bonus and withdrawing a bid will not leave any ETH locked in.
        <br />
        <br />
        <b>Partial Withdrawals:</b> You may still place bids, but the bonus has
        started decreasing linearly, and the amount of ETH locked in when
        withdrawing has started increasing linearly.
        <br />
        <br />
        <b>Withdrawal Lockup:</b> You may still place bids, but manual
        withdrawals are no longer permitted. The only way for a bid to be
        refunded is if the valuation exceeds its personal cap.
        <br />
        <br />
        <b>Finished:</b> You may now redeem your tokens and/or ETH.
      </span>
    ),
    selector: '#joyridePhase'
  },
  {
    text: (
      <span>
        This is the sale’s starting bonus.
        <br />
        <br />
        This will start decreasing linearly at the end of the full bonus phase
        down to zero at the end of the sale.
        <br />
        <br />
        A bid’s bonus increases its relative token purchasing power against
        other bids.
      </span>
    ),
    selector: '#joyrideStartingBonus'
  },
  {
    text: 'This is the sale’s current bonus.',
    selector: '#joyrideCurrentBonus'
  },
  {
    text: (
      <span>
        This slider lets you preview the bonus throughout the lifetime of the
        sale.
        <br />
        <br />
        The colored sections represent the different phases and the light blue
        bar represents the current time.
        <br />
        <br />
        Hover over it now to preview the bonus at any stage of the sale. Let’s
        skip time to the start of the sale.
      </span>
    ),
    selector: '#joyrideSlider'
  },
  {
    text: (
      <span>
        This is where you can make bids. The personal cap lets you set a max cap
        at which you are willing to participate in the sale with. If the
        valuation ends up exceeding this value, your bid will be automatically
        refunded.
        <br />
        <br />
        If you want to participate regardless of valuation, just check the “No
        Personal Cap” checkbox.
        <br />
        <br />
        Try placing a bid now and take advantage of the “Full Bonus” phase.
        <br />
        <br />
        <b>Place a bid to continue.</b>
      </span>
    ),
    selector: '#joyridePlaceBid',
    style: { button: { display: 'none' } }
  },
  {
    text: (
      <span>
        Congratulations on placing your first bid!
        <br />
        <br />
        Withdrawing now would give you all of your ETH back, but let’s skip
        through time to demonstrate the lock in process.
      </span>
    ),
    selector: '#joyridePlacedBid'
  },
  {
    text: (
      <span>
        We are now in the “Partial Withdrawals” phase.
        <br />
        <br />
        Try withdrawing your bid, you’ll only be able to withdraw whatever
        percentage of the “Partial Withdrawals” phase is left and your bonus
        will be reduced by 1/3.
        <br />
        <br />
        That is, if you are 80% through the phase, you’ll only be able to
        withdraw 20% of your bid and if your bonus was 15% it will be reduced to
        10%. This is to avoid blackout attacks by large players.
        <br />
        <br />
        See{' '}
        <a
          href="https://medium.com/kleros/how-interactive-coin-offerings-iicos-work-beed401ce526"
          rel="noopener noreferrer"
          target="_blank"
        >
          this
        </a>{' '}
        article to learn more.
      </span>
    ),
    selector: '#joyrideWithdraw',
    style: { button: { display: 'none' } }
  },
  {
    text: (
      <span>
        Nice, you've been refunded.
        <br />
        <br />
        Now, let’s skip to the end of the sale.
      </span>
    ),
    selector: '#joyrideWithdrew'
  },
  {
    text: (
      <span>
        Good job! Now you can redeem your tokens (for bids that stayed in the
        sale) and/or ETH (for bids where the personal cap ended up being under
        or in some cases equal to the valuation).
        <br />
        <br />
        <b>Redeem your bid to continue.</b>
      </span>
    ),
    selector: '#joyridePlacedBid',
    style: { button: { display: 'none' } }
  },
  {
    text: (
      <span>
        Great, you are now more than ready to take part in a real Interactive
        Coin Offering.
        <br />
        <br />
        Please let us know if you have any questions or concerns, feedback is
        greatly appreciated.
        <br />
        <br />
        You will now be transferred to the real IICO interface where you can
        make real transactions.
      </span>
    ),
    selector: '#joyrideFinish'
  }
]
