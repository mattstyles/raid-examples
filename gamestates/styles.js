
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
    transform: 'translate( -50%, -50% )'
  }
}

export default styles
