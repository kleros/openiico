import React from 'react'
import PropTypes from 'prop-types'

import './page-not-found.css'

const PageNotFound = ({ match: { params: { address } } }) => (
  <div className="PageNotFound">
    <div className="PageNotFound-message">
      <div className="PageNotFound-message-errorCode">404</div>
      This is not the page you are looking for.
      {address && (
        <p>
          Are you sure {address} is a valid contract address and that you are on
          the correct network?
        </p>
      )}
    </div>
  </div>
)

PageNotFound.propTypes = {
  // React Router
  match: PropTypes.shape({
    params: PropTypes.shape({ address: PropTypes.string }).isRequired
  }).isRequired
}

export default PageNotFound
