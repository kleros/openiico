import React from 'react'

import * as IICOSelectors from '../../../../reducers/iico'

const Info = ({ data }) => <div>{data.bonus}</div>

Info.propTypes = {
  // State
  data: IICOSelectors.IICODataShape.isRequired
}

export default Info
