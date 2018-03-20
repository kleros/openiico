import { form } from '../../../../utils/form-generator'
import { required } from '../../../../utils/validation'

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
    validate: [required]
  }
})
