import React from 'react'
import { storiesOf } from '@storybook/react'

import ValuationPieChart from '../src/components/valuation-pie-chart'

storiesOf('Valuation Pie Chart', module).add('activated', () => (
  <ValuationPieChart committed={20} total={100} size={80} />
))
