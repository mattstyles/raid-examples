
import styles from './styles'

let el = document.createElement( 'div' )

Object.assign( el.style, styles.root, {
  width: '640px',
  height: '480px',
  overflow: 'hidden',
  background: 'rgb( 20, 12, 27 )'
})

document.body.appendChild( el )

export default el
