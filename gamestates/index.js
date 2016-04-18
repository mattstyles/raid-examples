
import React from 'react'
import { render } from 'react-dom'
import root from './root'
import state from './appstate'
import View from './app'

function main( appstate ) {
  render( <View state={ appstate.get( 'root' ) } />, root )
}

state
  .on( 'update', main )
  .start()
