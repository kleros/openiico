import React from 'react'
import PropTypes from 'prop-types'

import './checkbox.css'

const Checkbox = ({ input: { value, onChange }, placeholder }) => (
  <div className="Checkbox">
    <input type="checkbox" value={value} onChange={onChange} />
    <div className="Checkbox-placeholder">{placeholder}</div>
  </div>
)

Checkbox.propTypes = {
  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired,

  // State
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired
}

export default Checkbox
