import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: SubmitBidForm,
  isInvalid: getSubmitBidFormIsInvalid,
  submit: submitSubmitBidForm
} = form(
  'submitBidForm',
  {
    amount: {
      type: 'text',
      validate: [required, number],
      props: { type: 'number' }
    },
    personalCap: {
      type: 'text',
      validate: [required, number],
      props: { type: 'number' },
      visibleIf: '!noPersonalCap'
    },
    noPersonalCap: {
      type: 'checkbox'
    }
  },
  {
    touchOnBlur: true,
    touchOnChange: true
  }
)
