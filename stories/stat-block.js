import React from 'react'
import { storiesOf } from '@storybook/react'

import StatBlock from '../src/components/stat-block'

storiesOf('Stat Block', module)
  .add('default', () => <StatBlock label="Label" value="300" />)
  .add('with no label', () => <StatBlock value="300" />)
