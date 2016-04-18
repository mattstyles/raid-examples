
import React from 'react'
import Immutable from 'immutable'
import { Signal } from 'raid'
import state from '../appstate'
import { STATES } from '../constants'

import start from './start'
import main from './main'

/**
 * View keys
 */
const states = {
  start,
  main
}

/**
 * Model
 */
const StateModel = new Immutable.Record({
  gamestate: STATES.START
})

const model = state.create( 'statemodel', new StateModel() )

/**
 * Update
 */
export const stateSignal = new Signal({ model })

stateSignal.register( src => {
  return src.subscribe( event => {
    if ( !/^state:/.test( event.next ) ) {
      throw new Error( `Invalid state id: ${ event.next }` )
    }

    model.cursor( 'gamestate' )
      .update( current => event.next )
  })
})

/**
 * View Router
 */
export const getState = () => {
  let currentState = model.cursor( 'gamestate' ).deref()
  let stateID = currentState.replace( /^state:/, '' )

  if ( !states[ stateID ] ) {
    throw new Error( `Invalid state id: ${ id }. State does not exist.` )
  }

  // Return the view function for React
  return states[ stateID ]
}
