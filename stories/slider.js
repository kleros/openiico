import React from 'react'
import { storiesOf } from '@storybook/react'

import Slider from '../src/components/slider'

const calcValue = percent => `${(percent * 100).toFixed(0)}%`

storiesOf('Slider', module).add('default', () => (
  <Slider startLabel="Jan 1st, 2018" endLabel="Today" calcValue={calcValue} />
))
