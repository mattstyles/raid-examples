
import { State } from 'raid'
import { STATES } from './constants'

/**
 * Central state object
 */

let state = new State()

export default state


// @TODO remove
window.state = state
