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
    onClick={onClick}
    className={`Button ${disabled ? 'is-disabled' : ''} ${className}`}
    {...rest}
  >
    <span className={`Button-label ${labelClassName}`}>{children}</span>
  </div>
)

Button.propTypes = {
  // State
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,

  // Handlers
  onClick: PropTypes.func.isRequired,

  // Modifiers
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string
}

Button.defaultProps = {
  // Modifiers
  disabled: false,
  className: '',
  labelClassName: ''
}

export default Button
