import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css';

import Auth from './hoc/auth'

function ModalApp(){
    return (
    <Suspense fallback={(<div>Loading...</div>)}>
    
        <Router>
            <div style={{minHeight:'calc(100vh - 80px)'}}>
                <Switch>
                    
                </Switch>

            </div>
        </Router>
    </Suspense>
    )
}

export default ModalApp