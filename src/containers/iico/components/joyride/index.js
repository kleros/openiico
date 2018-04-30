import React from 'react'
import PropTypes from 'prop-types'
import ReactJoyride from 'react-joyride'

import steps from './steps'

const Joyride = ({ getRef }) => (
  <ReactJoyride
    ref={getRef}
    steps={steps}
    run
    autoStart
    locale={{
      back: 'Go Back',
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip'
    }}
    showSkipButton
    showStepsProgress
    type="continuous"
    debug={process.env.NODE_ENV !== 'production'}
  />
)

Joyride.propTypes = {
  // Callbacks
  getRef: PropTypes.func.isRequired
}

export default Joyride
