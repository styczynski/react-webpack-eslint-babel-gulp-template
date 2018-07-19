import React from 'react'
import * as styles from './index.css'
import { LibComponent } from "../../../target-lib/common.lib.min.js";

class Home extends React.Component {
  render() {
    return (
      <div styleName="Home">
        <b>HELLO!</b>
        <LibComponent/>
      </div>
    )
  }
}

export default Home