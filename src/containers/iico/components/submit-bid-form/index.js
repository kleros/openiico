import { form } from '../../../../utils/form-generator'
import {
  required,
  number,
  positive,
  nonZero
} from '../../../../utils/validation'

export const {
  Form: SubmitBidForm,
  isInvalid: getSubmitBidFormIsInvalid,
  submit: submitSubmitBidForm
} = form('submitBidForm', {
  amount: {
    type: 'text',
    validate: [required, number, positive, nonZero],
    props: {
      type: 'number',
      step: 1e-18,
      placeholder: 'Amount (ETH)'
    }
  },
  personalCap: {
    type: 'text',
    validate: [required, number, positive, nonZero],
    props: {
      type: 'number',
      step: 1e-18,
      placeholder: 'Personal Cap (ETH)'
    },
    visibleIf: '!noPersonalCap'
  },
  noPersonalCap: {
    type: 'checkbox'
  }
})
