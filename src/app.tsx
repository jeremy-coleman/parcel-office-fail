import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {App} from './main'


const el = document.createElement("div");
document.body.appendChild(el);


// render

ReactDOM.render(<App/>, el);

//@ts-ignore
if(module.hot){module.hot.acccept()}