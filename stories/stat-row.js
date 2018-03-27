import React from 'react'
import { storiesOf } from '@storybook/react'

import StatBlock from '../src/components/stat-block'
import StatRow from '../src/components/stat-row'

const blocks = [
  { label: 'Label', value: '300' },
  { label: 'Label', value: '300' },
  { label: 'Label', value: '300' }
].map(props => <StatBlock {...props} />)

storiesOf('Stat Row', module)
  .add('default', () => <StatRow>{blocks}</StatRow>)
  .add('with box shadow', () => <StatRow withBoxShadow>{blocks}</StatRow>)
