import React from 'react'
import PropTypes from 'prop-types'

import './button.css'

const Button = ({
  children,
  onClick,
  disabled,
  className,
  labelClassName,
  ...rest
}) => (
  <div
    onClick={disabled ? null : onClick}
    className={`Button ${disabled ? 'is-disabled' : ''} ${className}`}
    {...rest}
  >
    <div className={`Button-label ${labelClassName}`}>{children}</div>
  </div>
)

Button.propTypes = {
  // State
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,

  // Handlers
  onClick: PropTypes.func,

  // Modifiers
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string
}

Button.defaultProps = {
  // Handlers
  onClick: null,

  // Modifiers
  disabled: false,
  className: '',
  labelClassName: ''
}

export default Button
