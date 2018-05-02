import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReduxToastr from 'react-redux-toastr'

export default () => (
  <div id="global-components">
    <ReactTooltip />
    <ReduxToastr
      timeOut={0}
      position="top-center"
      transitionIn="bounceInDown"
      transitionOut="bounceOutUp"
      progressBar
    />
  </div>
)
