
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Observable } from 'rx-lite'
import Immutable from 'immutable'
import { State, Signal } from 'raid'
import { TickSignal } from 'raid-addons'



/**
 * Central state object
 */
let state = new State()

let root = document.createElement( 'div' )

/**
 * Model
 */
const Robot = new Immutable.Record({
  id: 0,
  x: 0,
  y: 0,
  rot: 0
})

let uid = 0

let list = state.create( 'robots', [] )

function createRobot( props ) {
  return new Robot( Object.assign({
    id: ++uid
  }, props ))
}

/**
 * Click Update
 */
const click = new Signal({
  model: list
})

root.addEventListener( 'mousemove', event => {
  const { x, y } = event
  click.dispatch({ x, y })
})

click.register( src => {
  src
    .subscribe( event => {
      event.model.update( robots => {
        return robots.concat([
          createRobot({
            x: event.x,
            y: event.y
          })
        ])
      })
    })
})


/**
 * Tick Update
 */
const tick = TickSignal({
  model: list
})

tick.register( src => {
  src.subscribe( event => {
    let dt = event.delta * .25
    event.model.update( robots => {
      return robots.map( robot => {
        return robot.update( 'rot', rot => rot + dt )
      })
    })
  })
})


/**
 * View
 */
const styles = {}
styles.container = {
  position: 'absolute',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  background: 'rgb( 20, 12, 28 )'
}
styles.robot = {
  position: 'absolute',
  width: 16,
  height: 16
}

const App = props => {
  let robots = props.state.get( 'robots' )
    .map( robot => {
      let style = Object.assign( {}, styles.robot, {
        left: robot.get( 'x' ),
        top: robot.get( 'y' ),
        transform: `rotate( ${ robot.get( 'rot' ) }deg )`
      })

      return (
        <img
          key={ robot.get( 'id' ) }
          src="/robotmark/img/robot.png"
          style={ style }
        />
      )
    })

  return (
    <div style={ styles.container }>
      <div style={{ color: 'white' }}>
        { `count: ${ props.state.get( 'robots' ).count() }` }
      </div>
      { robots }
    </div>
  )
}

/**
 * Main()
 */
document.body.appendChild( root )

function main( appstate ) {
  render( <App state={ appstate.get() } />, root )
}

state
  .on( 'update', main )
  .start()
