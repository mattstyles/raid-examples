
import React, { Component } from 'react'
import { KeySignal } from 'raid-addons'
import { stateSignal } from './'
import { STATES } from '../constants'

const keyDown = new KeySignal()

export default class Start extends Component {
  constructor( props ) {
    super( props )
  }

  componentWillMount() {
    this.keyRelease = keyDown.register( src => {
      console.log( 'subscribing' )
      return src.subscribe( event => {
        console.log( 'clickety click' )
      })
    })
  }

  componentWillUnmount() {
    this.keyRelease()
  }

  render() {
    return (
      <h1 style={{color:'white'}}>Main</h1>
    )
  }
}
