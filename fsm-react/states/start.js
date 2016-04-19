
import React, { Component } from 'react'
import { KeySignal } from 'raid-addons'
import { stateSignal } from './'
import { STATES } from '../constants'
import styles from '../styles'

/**
 * Style
 */
const style = {
  text: {
  },
  start: {
    fontSize: 20,
    color: 'rgb( 222, 238, 214 )',
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    width: '100%'
  }
}

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
      <div style={ style.text && styles.fit }>
        <span style={ style.start }>Hit Space To Start</span>
      </div>
    )
  }
}
