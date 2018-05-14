import React from 'react'
import { storiesOf } from '@storybook/react'

import ETHQR from '../src/components/eth-qr'

storiesOf('ETH QR', module).add('with address(0)', () => (
  <ETHQR to="0x0000000000000000000000000000000000000000" />
))
