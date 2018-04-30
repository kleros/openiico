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
  }
]
