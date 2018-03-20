import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: IICODataShape,
  initialState: IICODataInitialState
} = createResource(PropTypes.shape({ address: PropTypes.string.isRequired }))
export { IICODataShape }

// Reducer
export default createReducer({
  IICOData: IICODataInitialState
})

// Selectors
