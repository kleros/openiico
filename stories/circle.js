import React from 'react'
import { storiesOf } from '@storybook/react'

import Circle from '../src/components/circle'

storiesOf('Circle', module).add('default', () => (
  <Circle size={30} color="#eee" />
))
