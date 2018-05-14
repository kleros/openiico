import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: FinalizeIICOForm,
  isInvalid: getFinalizeIICOFormIsInvalid,
  submit: submitFinalizeIICOForm
} = form('finalizeIICOForm', {
  maxIterations: {
    type: 'text',
    validate: [required, number],
    props: { type: 'number' }
  }
})
