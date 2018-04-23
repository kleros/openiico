import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as toastr } from 'react-redux-toastr'
import { reducer as form } from 'redux-form'

import wallet from './wallet'
import IICO from './iico'

// Export root reducer
export default combineReducers({
  router,
  toastr,
  form,
  wallet,
  IICO
})
