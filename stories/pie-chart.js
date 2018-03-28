import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../src/components/pie-chart'

storiesOf('Pie Chart', module).add('activated', () => (
  <PieChart slice={20} total={100} size={80} />
))
