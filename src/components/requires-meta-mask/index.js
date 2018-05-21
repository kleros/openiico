import React from 'react'
import PropTypes from 'prop-types'

import metaMaskLogo from '../../assets/images/meta-mask-logo.png'
import Button from '../button'

import './require-meta-mask.css'

const RequiresMetaMask = ({ needsUnlock }) => (
  <div className="RequiresMetaMask">
    <img
      src={metaMaskLogo}
      alt="MetaMask Logo"
      className="RequiresMetaMask-logo"
    />
    <div className="RequiresMetaMask-content">
      <span>
        This is a decentralized application. In order to use this site please{' '}
        {needsUnlock ? 'unlock' : 'download'} MetaMask.
      </span>
      <a
        href={
          needsUnlock
            ? 'https://metamask.helpscoutdocs.com/article/58-metamask-basics'
            : 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="RequiresMetaMask-content-button">
          {needsUnlock ? 'Unlock' : 'Download'} MetaMask
        </Button>
      </a>
    </div>
  </div>
)

RequiresMetaMask.propTypes = {
  // State
  needsUnlock: PropTypes.bool
}

RequiresMetaMask.defaultProps = {
  // State
  needsUnlock: false
}

export default RequiresMetaMask
