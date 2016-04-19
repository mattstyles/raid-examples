
import React, { Component } from 'react'
import Immutable from 'immutable'
import state from '../appstate'
import { KeySignal, TickSignal } from 'raid-addons'
import { STATES } from '../constants'
import styles from '../styles'

/**
 * Model
 */
const Ship = new Immutable.Record({
  x: 0,
  y: 0,
  thrust: 0,
  vx: 0,
  vy: 0,
  rot: 0
})

const model = state.create( 'ship', new Ship({
  x: 100,
  y: 80,
  rot: Math.random() * 360 | 0
}))

/**
 * Keys Update
 */
const keys = KeySignal({ model })

/**
 * Tick Update
 */
const tick = TickSignal({ model })


/**
 * View
 */
export default class Main extends Component {
  constructor( props ) {
    super( props )
  }

  componentWillMount() {
    this.keyRelease = keys.register( src => {
      return src.subscribe( event => {
        if ( event.keys.has( '<left>' ) ) {
          event.model.cursor( 'rot' ).update( rotation => --rotation )
        }

        if ( event.keys.has( '<right>' ) ) {
          event.model.cursor( 'rot' ).update( rotation => ++rotation )
        }

        if ( event.keys.has( '<up>' ) ) {
          event.model.cursor( 'thrust' ).update( thrust => 10 )
        }
      })
    })

    // this.tickRelease = tick.register( src => {
    //   src.subscribe( event => {
    //     let dt = event.delta * .25
    //     event.model.update( ship => {
    //       return ship.update( 'rot', rot => rot + dt )
    //     })
    //   })
    // })
  }

  componentWillUnmount() {
    this.keyRelease()
    this.tickRelease()
  }

  render() {
    let ship = model.cursor()
    let style = styles.merge( styles.ship, {
      left: ship.get( 'x' ),
      top: ship.get( 'y' ),
      transform: `rotate( ${ ship.get( 'rot' ) }deg )`
    })

    return (
      <div style={ styles.fit }>
        <img
          src="/fsm-react/assets/ship.png"
          style={ style }
        />
      </div>
    )
  }
}
