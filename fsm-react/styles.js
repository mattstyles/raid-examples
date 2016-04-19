
/**
 * Style objects
 */
const styles = {
  // Methods
  merge() {
    return Object.assign( {}, ...arguments )
  },

  // Styles
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate( -50%, -50% )',
    fontFamily: 'Coolville, monospaced'
  },

  fit: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  ship: {
    position: 'absolute',
    width: 16,
    height: 16
  }

}

export default styles


/**
 * Append font-face
 */
let styleEl = document.createElement( 'style' )
styleEl.type = 'text/css'
styleEl.textContent = `
  @font-face: {
    font-family: 'Coolville',
    src: url( '/fsm/assets/Coolville.ttf' )
  }
`

document.head.appendChild( styleEl )
