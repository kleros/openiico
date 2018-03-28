import React from 'react'
import { storiesOf } from '@storybook/react'

import StatBlock from '../src/components/stat-block'
import StatRow from '../src/components/stat-row'

const blocks = [
  { label: 'Label 1', value: '300' },
  { label: 'Label 2', value: '300' },
  { label: 'Label 3', value: '300' }
].map(block => <StatBlock key={block.label + block.value} {...block} />)

storiesOf('Stat Row', module)
  .add('default', () => <StatRow>{blocks}</StatRow>)
  .add('with box shadow', () => <StatRow withBoxShadow>{blocks}</StatRow>)
