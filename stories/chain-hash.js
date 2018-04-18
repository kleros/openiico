import React from 'react'
import { storiesOf } from '@storybook/react'

import ChainHash from '../src/components/chain-hash'

storiesOf('Chain Hash', module).add('default', () => (
  <ChainHash>{'0x5b5d09477f730baafb1e2e0fb78f5d95fd94a6f4'}</ChainHash>
))
