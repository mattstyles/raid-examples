
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
      <div style={ styles.fit }>
        <span style={ styles.text }>Hit Space To Start</span>
      </div>
    )
  }
}
