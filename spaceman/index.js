
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Observable } from 'rx-lite'
import Immutable from 'immutable'
import { State, Signal } from 'raid'
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
  vy: 0
})

let spaceman = state.create( 'spaceman', new Model({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
}))


/**
 * Key Signal
 */
const keys = new Signal({
  model: spaceman
})

quay.on( '<up>', event => keys.dispatch( '<up>' ) )
quay.on( '<down>', event => keys.dispatch( '<down>' ) )
quay.on( '<left>', event => keys.dispatch( '<left>' ) )
quay.on( '<right>', event => keys.dispatch( '<right>' ) )

/**
 * Key Update
 */
keys.register( src => {
  const jump = src
    .filter( event => event.type === '<up>' )
    .filter( event => {
      const { y, vy } = event.model.toJS()
      return !( y && vy )
    })
    .map( event => () => {
      event.model.cursor( 'vy' ).update( vy => 6 )
    })

  const walk = src
    .filter( event => /left|right/.test( event.type ) )
    .map( event => () => {
      event.model.cursor( 'vx' ).update( vx => {
        return /left/.test( event.type ) ? -1 : 1
      })
    })

  return Observable.merge( [ jump, walk ] )
    .subscribe( action => action() )
})

/**
 * Tick signal
 */
const tick = new Signal({
  model: spaceman
})

raf().on( 'data', dt => tick.dispatch({
  delta: dt * .05
}))

/**
 * Tick Update
 */
tick.register( src => {
  // In this case gravity depletes velocity
  // const gravity = src
  //   .map( event => () => {
  //     event.model.update( model => {
  //       return model.merge({
  //         vy: model.y > 0 ? model.vy - event.delta * .25 : 0
  //       })
  //     })
  //   })
  //
  // const physics = src
  //   .map( event => () => {
  //     event.model.update( model => {
  //       return model.merge({
  //         x: model.x + event.delta * model.vx,
  //         y: Math.max( 0, model.y + event.delta * model.vy ),
  //         vx: 0
  //       })
  //     })
  //   })
  //
  // Order IS important, this is not functional composition although changes
  // to models in earlier functions do propagate
  // return Observable.merge( [ physics, gravity ] )
  //   .subscribe( action => action() )

  // Updates accept mutable versions of models
  const physics = ( dt, model ) => {
    return Object.assign( model, {
      x: model.x + dt * model.vx,
      y: Math.max( 0, model.y + dt * model.vy ),
      vx: 0
    })
  }

  // Values are regular JS mutable objects
  const gravity = ( dt, model ) => {
    return Object.assign( model, {
      vy: model.y > 0 ? model.vy - dt * .25 : 0
    })
  }



  const update = src
    .subscribe( event => {

      // Updates the model with the new model
      function compose( model ) {
        // Perform mutation
        event.model.merge( model )
      }

      // @TODO mmm, composition, needs a little jiggling
      compose( gravity( event.delta, physics( event.delta, event.model.toJS() ) ) )
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
styles.spaceman = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 32,
  height: 32,
  background: 'rgb( 208, 70, 72 )',
  borderRadius: 200
}

const Spaceman = props => {
  const data = spaceman.cursor()
  var pos = Object.assign( {}, styles.spaceman, {
    top: 200 - data.get( 'y' ),
    left: 200 + data.get( 'x' )
  })
  return (
    <div style={ pos }></div>
  )
}

const App = props => {
  return (
    <div style={ styles.container }>
      <pre>
        { JSON.stringify( spaceman.cursor().toJSON(), null, '  ' ) }
      </pre>
      <Spaceman />
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
