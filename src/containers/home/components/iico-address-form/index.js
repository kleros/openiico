import { getChecksumAddress } from 'ethjs-account'

import { form } from '../../../../utils/form-generator'
import { required, isETHAddress } from '../../../../utils/validation'
import { ETHAddressRegExp } from '../../../../bootstrap/dapp-api'

export const {
  Form: IICOAddressForm,
  isInvalid: getIICOAddressFormIsInvalid,
  submit: submitIICOAddressForm
} = form('IICOAddressForm', {
  header: {
    type: 'header',
    props: { title: 'Enter the address of the IICO and hit enter.' }
  },
  address: {
    type: 'text',
    validate: [required, isETHAddress],
    reduxFormFieldProps: {
      normalize: value =>
        ETHAddressRegExp.test(value) ? getChecksumAddress(value) : value
    }
  }
})
