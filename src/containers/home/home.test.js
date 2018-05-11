import toJson from 'enzyme-to-json'

import setupIntegrationTest, {
  flushPromises
} from '../../bootstrap/setup-integration-test'

import Home from '.'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null,
  contracts: null
}

beforeEach(async () => {
  integration = await setupIntegrationTest({ router: { location: '/' } })
})

it("Renders and loads an IICO contract's data after submitting an address.", async () => {
  // Initial render
  const app = integration.mountApp()
  await flushPromises(app)
  expect(toJson(app.find(Home))).toMatchSnapshot()

  // Enter an address
  app.find('.TextInput-input').simulate('change', {
    target: { value: 'Enter an address' }
  })
  expect(toJson(app.find(Home))).toMatchSnapshot()
  app.find('.TextInput-input').simulate('change', {
    target: { value: integration.contracts.IICO.address }
  })

  // Submit address
  app.find('.Home').simulate('keypress', { key: 'Enter' })
  await flushPromises(app)
  app.find('.TextInput-input').simulate('change', {
    target: { value: 'Submit address' }
  })
  expect(app.find(Home).text()).toMatchSnapshot()
})
