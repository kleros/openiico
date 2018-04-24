import createReduxForm from 'create-redux-form'

import FormHeader from '../components/form-header'
import TextInput from '../components/text-input'
import Checkbox from '../components/checkbox'

export const { form, wizardForm } = createReduxForm({
  header: FormHeader,
  text: TextInput,
  checkbox: Checkbox
})
