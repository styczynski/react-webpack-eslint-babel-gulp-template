import React from 'react'
import ReactDOM from 'react-dom'

import Home from './components/Home'

document.addEventListener('DOMContentLoaded', function() {
  const rootEl = document.createElement('div');
  document.body.appendChild(rootEl);

  ReactDOM.render(
    <Home />,
      rootEl
  )
})