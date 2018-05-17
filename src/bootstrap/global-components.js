import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReduxToastr from 'react-redux-toastr'

export default () => (
  <div id="global-components">
    <ReduxToastr
      timeOut={0}
      preventDuplicates
      position="top-center"
      transitionIn="bounceInDown"
      transitionOut="bounceOutUp"
      progressBar
    />
    <ReactTooltip multiline html />
  </div>
)
