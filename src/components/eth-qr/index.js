import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'
import { SyncLoader } from 'react-spinners'

export default class ETHQR extends PureComponent {
  static propTypes = {
    // State
    to: PropTypes.string.isRequired,
    size: PropTypes.number
  }

  static defaultProps = {
    // State
    size: 200
  }

  state = { dataURL: null }

  constructor(props) {
    super(props)
    this.generateDataURL()
  }

  componentDidUpdate() {
    this.generateDataURL()
  }

  generateDataURL = async () => {
    const { to } = this.props

    this.setState({
      dataURL: await QRCode.toDataURL(to)
    })
  }

  render() {
    const { size } = this.props
    const { dataURL } = this.state

    return dataURL ? (
      <img
        src={dataURL}
        alt="Ethereum Transaction QR Code"
        style={{ width: size, height: size }}
      />
    ) : (
      <SyncLoader color="#9b9b9b" size={8} />
    )
  }
}
