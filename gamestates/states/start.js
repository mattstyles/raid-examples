
import React, { Component } from 'react'
import { KeySignal } from 'raid-addons'
import { stateSignal } from './'
import { STATES } from '../constants'

/**
 * Update Signal
 */
const keyDown = new KeySignal()

/**
 * View
 */
export default class Start extends Component {
  constructor( props ) {
    super( props )
  }

  componentWillMount() {
    this.keyRelease = keyDown.register( src => {
      console.log( 'subscribing' )
      return src.subscribe( event => {
        console.log( 'clickety click' )

        if ( event.keys.has( '<space>' ) ) {
          stateSignal.dispatch({
            next: STATES.MAIN
          })
        }
      })
    })
  }

  componentWillUnmount() {
    this.keyRelease()
  }

  render() {
    return (
      <h1 style={{color:'white'}}>Start</h1>
    )
  }
}
