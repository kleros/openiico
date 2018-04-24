import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'

import Checkbox from '../src/components/checkbox'

storiesOf('Checkbox', module).add(
  'default',
  withState(
    {
      input: { value: false, onChange: null },
      placeholder: 'ACTIVE'
    },
    store => (
      <Checkbox
        {...store.state}
        input={{
          ...store.state.input,
          onChange: event =>
            store.set({
              input: { value: event.currentTarget.value, onChange: null }
            })
        }}
      />
    )
  )
)
