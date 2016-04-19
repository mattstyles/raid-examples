
import React, { Component } from 'react'
import { KeySignal } from 'raid-addons'
import { stateSignal } from './'
import { STATES } from '../constants'
import styles from '../styles'

/**
 * Update Signal
 */
const keyDown = KeySignal()

/**
 * View
 */
export default class Start extends Component {
  constructor( props ) {
    super( props )
  }

  componentWillMount() {
    this.keyRelease = keyDown.register( src => {
      return src.subscribe( event => {
        if ( event.keys.has( '<enter>' ) ) {
          stateSignal.dispatch({
            next: STATES.START
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
      <div style={ styles.fit }>
        <div style={ styles.text }>
          <div>Well done, you made it Commander!</div>
          <div>Hit enter to restart</div>
        </div>
      </div>
    )
  }
}
