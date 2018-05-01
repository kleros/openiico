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
      </span>
    ),
    selector: '#joyrideWelcome'
  },
  {
    text:
      'This is the ICO’s contract address. You can hover over it to see it in full and you can click on it to explore the contract on etherscan. Try doing that now.',
    selector: '#joyrideTokenContractAddress'
  },
  {
    text:
      'This is the amount of tokens that are up for sale. They will be distributed proportionally across all bidders relative to the size of their contributions and bonuses.',
    selector: '#joyrideTokensForSale'
  },
  {
    text:
      'This is the sale’s current valuation. That is, if the sale were to end now and personal caps were taken into account to see which ones should be refunded. The number is truncated to two significant digits, but you can hover over it to see it in full.',
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
    text:
      'This is the sale’s starting bonus. This will start decreasing linearly at the end of the full bonus phase down to zero at the end of the sale. A bid’s bonus increases its token purchasing power. For example, a 20% bonus will give you 20% more tokens for the same amount of ETH.',
    selector: '#joyrideStartingBonus'
  },
  {
    text: 'This is the sale’s current bonus.',
    selector: '#joyrideCurrentBonus'
  },
  {
    text:
      'This slider lets you preview the bonus throughout the lifetime of the sale. The green bars represent a change of phase and the light blue bar represents the current time. Hover over it now to preview the bonus at any stage of the sale. Let’s skip time to the start of the sale.',
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
        Place a bid to continue.
      </span>
    ),
    selector: '#joyridePlaceBid',
    style: { button: { display: 'none' } }
  },
  {
    text:
      'Congratulations on placing your first bid! Withdrawing now would give you all of your ETH back, but let’s skip through time to demonstrate the lock in process.',
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
        See this article to learn more.
      </span>
    ),
    selector: '#joyrideWithdraw',
    style: { button: { display: 'none' } }
  },
  {
    text: "Nice, you've been refunded. Now, let’s skip to the end of the sale.",
    selector: '#joyrideWithdrew'
  },
  {
    text: (
      <span>
        Now, the contract needs to iterate over all the bids to finalize the
        sale. This may be done by anyone so you might not even get to see this
        part of the sale.
        <br />
        <br />
        Enter the number of iterations you’d like to pay gas for and submit to
        finalize the sale.
        <br />
        <br />
        Five iterations is more than enough since you only made one bid.
      </span>
    ),
    selector: '#joyridePlaceBid',
    style: { button: { display: 'none' } }
  },
  {
    text: (
      <span>
        Good job! Now you can redeem your tokens (for bids that stayed in the
        sale) and/or ETH (for bids where the personal cap ended up being under
        the valuation).
        <br />
        <br />
        Redeem your bid to continue.
      </span>
    ),
    selector: '#joyrideWithdraw',
    style: { button: { display: 'none' } }
  },
  {
    text:
      'Great, you are now more than ready to take part in a real Interactive Coin Offering. Please let us know if you have any questions or concerns, feedback is greatly appreciated.',
    selector: '#joyrideFinish'
  }
]
