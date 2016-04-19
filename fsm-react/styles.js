
import WebFont from 'webfontloader'
import root from './root'

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
    fontFamily: 'Orbitron, monospaced'
  },

  fit: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  text: {
    fontSize: 18,
    lineHeight: 2,
    color: 'rgb( 109, 170, 44 )',
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    width: '100%'
  },

  ship: {
    position: 'absolute',
    width: 16,
    height: 16,
    zIndex: 100,
    imageRendering: 'pixelated'
  },

  winZone: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 0,
    width: 100,
    background: 'repeating-linear-gradient( -45deg, rgb( 20, 12, 27 ), rgb( 20, 12, 27 ) 30px, rgb( 218, 212, 94 ) 30px, rgb( 218, 212, 94 ) 60px )',
    zIndex: 50
  }
}

export default styles


/**
 * Append font-face
 */
WebFont.load({
  google: {
    families: [ 'Orbitron::latin' ]
  },
  timeout: 2000,
  active: () => {
    root.style.opacity = 1
  },
  inactive: () => {
    root.style.opacity = 1
  }
})
