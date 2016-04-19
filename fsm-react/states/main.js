
import React, { Component } from 'react'
import Immutable from 'immutable'
import state from '../appstate'
import { curry, compose, KeySignal, TickSignal } from 'raid-addons'
import { stateSignal } from './'
import { STATES } from '../constants'
import styles from '../styles'

const DEGREES = Math.PI / 180
const THRUST = .5
const DRAG = .95

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
  x: 20 + ( Math.random() * 200 | 0 ),
  y: 20 + ( Math.random() * 400 | 0 ),
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

    model.cursor().merge({
      x: 20 + ( Math.random() * 200 | 0 ),
      y: 20 + ( Math.random() * 400 | 0 ),
      vx: 0,
      vy: 0
    })
  }

  componentWillMount() {
    this.keyRelease = keys.register( src => {
      return src.subscribe( event => {
        if ( event.keys.has( '<left>' ) ) {
          event.model.cursor( 'rot' ).update( rotation => rotation - 3 )
        }

        if ( event.keys.has( '<right>' ) ) {
          event.model.cursor( 'rot' ).update( rotation => rotation + 3 )
        }

        if ( event.keys.has( '<up>' ) ) {
          event.model.cursor( 'thrust' ).update( thrust => THRUST )
        }
      })
    })

    this.tickRelease = tick.register( src => {
      const momentum = curry( ( dt, model ) => {
        return Object.assign( model, {
          x: model.x + dt * model.vx,
          y: model.y + dt * model.vy
        })
      })

      const thrust = curry( ( dt, model ) => {
        if ( !model.thrust ) {
          return model
        }

        return Object.assign( model, {
          vx: model.vx + ( model.thrust * dt * Math.cos( model.rot * DEGREES ) ),
          vy: model.vy + ( model.thrust * dt * Math.sin( model.rot * DEGREES ) ),
          thrust: 0
        })
      })

      const drag = curry( ( dt, model ) => {
        let dx = model.vx * DRAG
        let dy = model.vy * DRAG
        return Object.assign( model, {
          vx: Math.abs( dx ) < .15 ? 0 : dx,
          vy: Math.abs( dy ) < .15 ? 0 : dy
        })
      })

      const win = model => {
        if ( model.x > 540 ) {
          stateSignal.dispatch({
            next: STATES.FINAL
          })
        }

        return model
      }

      return src.subscribe( event => {
        let dt = event.delta * .05
        let update = compose(
          momentum( dt ),
          thrust( dt ),
          drag( dt ),
          win
        )

        event.model.merge( update( event.model.toJS() ) )
      })
    })
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
      transform: `rotate( ${ ship.get( 'rot' ) + 90 }deg )`
    })

    return (
      <div style={ styles.fit }>
        <img
          src="/fsm-react/assets/ship.png"
          style={ style }
        />
        <div style={ styles.winZone }></div>
      </div>
    )
  }
}
