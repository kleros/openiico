import React from 'react'
import { storiesOf } from '@storybook/react'

import ChainNumber from '../src/components/chain-number'

storiesOf('Chain Number', module).add('default', () => (
  <ChainNumber>{0.000123}</ChainNumber>
))
