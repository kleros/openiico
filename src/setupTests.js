// eslint-disable-next-line unicorn/filename-case
import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import timezoneMock from 'timezone-mock'
import 'jest-enzyme'

// Configure
configure({ adapter: new Adapter() })

// Mock modules
jest.mock('./components/identicon', () => () => <div>[Identicon]</div>)

// Mock fetch
window.fetch = jest.fn(() => new Promise(resolve => resolve(undefined)))

// Mock time
timezoneMock.register('UTC')
Date.now = jest.fn(() => 1516916214006)
