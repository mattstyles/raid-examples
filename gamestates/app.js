
import React from 'react'
import { getState } from './states'

/**
 * Main app view
 * ---
 * Simply handles switches app state
 */

const App = props => {
  const { state } = props
  const View = getState()
  return <View />
}

export default App
