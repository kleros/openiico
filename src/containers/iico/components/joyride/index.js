import React from 'react'
import PropTypes from 'prop-types'
import ReactJoyride from 'react-joyride'

import steps from './steps'

const Joyride = ({ getRef, callback }) => (
  <ReactJoyride
    ref={getRef}
    steps={steps}
    run
    autoStart
    keyboardNavigation={false}
    locale={{
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip'
    }}
    showBackButton={false}
    showSkipButton
    showStepsProgress
    type="continuous"
    // debug={process.env.NODE_ENV !== 'production'}
    callback={callback}
  />
)

Joyride.propTypes = {
  // Callbacks
  getRef: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired
}

export default Joyride
