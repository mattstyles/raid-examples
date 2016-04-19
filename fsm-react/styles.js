
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

  text: {
    fontSize: 20,
    lineHeight: 1.4,
    color: 'rgb( 222, 238, 214 )',
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    width: '100%'
  },

  ship: {
    position: 'absolute',
    width: 16,
    height: 16,
    zIndex: 100
  },

  winZone: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 0,
    width: 100,
    background: 'rgb( 68, 36, 52 )',
    zIndex: 50
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
