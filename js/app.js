require('style!../stylus/styles.styl');

import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

render(<App />, document.getElementById('mirror'))
