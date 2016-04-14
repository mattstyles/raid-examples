
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Observable } from 'rx-lite'
import Immutable from 'immutable'
import { State, Signal } from 'raid'
import { curry } from 'ramda'
import raf from 'raf-stream'
import Quay from 'quay'


let quay = new Quay()
let state = new State()

/**
 * Model
 */
const Model = new Immutable.Record({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  dir: ''
})

let mario = state.create( 'mario', new Model({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  dir: 'right'
}))


/**
 * Key Signal
 */
const keys = new Signal({
  model: mario
})

quay.on( '<up>', event => keys.dispatch( '<up>' ) )
quay.on( '<down>', event => keys.dispatch( '<down>' ) )
quay.on( '<left>', event => keys.dispatch( '<left>' ) )
quay.on( '<right>', event => keys.dispatch( '<right>' ) )

/**
 * Key Update
 * ---
 * This example uses a merged observable to mutate state
 */
keys.register( src => {
  const jump = src
    .filter( event => event.type === '<up>' )
    .filter( event => {
      const { y, vy } = event.model.toJS()
      return !( y && vy )
    })
    .map( event => () => {
      event.model.cursor( 'vy' ).update( vy => 7.5 )
    })

  const walk = src
    .filter( event => /left|right/.test( event.type ) )
    .map( event => () => {
      let left = /left/.test( event.type )
      event.model.merge({
        vx: left ? -1 : 1,
        dir: left ? 'left' : 'right'
      })
    })

  return Observable.merge( [ jump, walk ] )
    .subscribe( action => action() )
})

/**
 * Tick signal
 */
const tick = new Signal({
  model: mario
})

raf().on( 'data', dt => tick.dispatch({
  delta: dt * .05
}))

/**
 * Tick Update
 * ---
 * This example uses functional composition to mutate state
 */
tick.register( src => {
  // Updates accept mutable versions of models
  const physics = curry( ( dt, model ) => {
    return Object.assign( model, {
      x: model.x + dt * model.vx,
      y: Math.max( 0, model.y + dt * model.vy ),
      vx: Math.abs( model.vx ) < .25 ? 0 : model.vx * .75
    })
  })

  // Values are regular JS mutable objects
  const gravity = curry( ( dt, model ) => {
    return Object.assign( model, {
      vy: model.y > 0 ? model.vy - dt * .25 : 0
    })
  })

  function compose() {
    let fns = Array.from( arguments )
    return function exec( model ) {
      return fns.reduce( ( m, fn ) => {
        return fn( m )
      }, model )
    }
  }

  const release = src
    .subscribe( event => {
      let update = compose(
        physics( event.delta ),
        gravity( event.delta )
      )

      event.model.merge( update( event.model.toJS() ) )
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
  background: 'rgb( 78, 74, 78 )'
}
styles.mario = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 25,
  height: 45
}

const Mario = props => {
  const data = mario.cursor()
  let pos = Object.assign( {}, styles.mario, {
    top: 200 - data.get( 'y' ),
    left: 200 + data.get( 'x' )
  })
  let verb = 'stand'
  if ( data.get( 'vx' ) !== 0 ) {
    verb = 'walk'
  }
  if ( data.get( 'y' ) > 0 ) {
    verb = 'jump'
  }
  return (
    <img style={ pos } src={ `/mario/imgs/${ verb }-${ data.get( 'dir' ) }.gif` } />
  )
}

const App = props => {
  return (
    <div style={ styles.container }>
      <pre>
        Model:
        { JSON.stringify( mario.cursor().toJSON(), null, '  ' ) }
      </pre>
      <Mario />
    </div>
  )
}


/**
 * Main()
 */
let root = document.createElement( 'div' )
document.body.appendChild( root )

function main( appstate ) {
  render( <App state={ appstate.get() } />, root )
}

state
  .on( 'update', main )
  .start()
