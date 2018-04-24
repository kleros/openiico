import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { toastr } from 'react-redux-toastr'

import Button from '../src/components/button'

class Component extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired
  }

  handleButtonClick = () => {
    const { type } = this.props
    toastr[type]('The Title', 'The message.')
  }

  render() {
    return <Button onClick={this.handleButtonClick}>TOAST</Button>
  }
}

const stories = storiesOf('Toast', module)
for (const type of [
  'info',
  'warning',
  'success',
  'error',
  'message',
  'confirm'
]) {
  stories.add(type, type => () => <Component type={type} />)
}
