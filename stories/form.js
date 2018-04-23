import React from 'react'
import { storiesOf } from '@storybook/react'

import FormHeader from '../src/components/form-header'

storiesOf('Form', module).add('header', () => (
  <FormHeader title="PLACEHOLDER" />
))
