import React from 'react';
import Login from './Login';
import Register from './Register';
import "./AppUnlogged.css"


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class AppUnlogged extends React.PureComponent<TProps>{
  render(){
    return(

      <div className="AppUnloggedBackground">
    <div className="container-fluid AppUnloggedBackground">
        <div className="row">
            <div className="col-12">
                <Login></Login>
            </div>
        </div>
        <div className="container">
        <div className="row centerForm">
      <div className="col-sm-6 col-12 "><Register></Register></div>
      {/* <div className="col-6"><img src="./pngguru.com.png" alt=""/></div> */}
        </div>
        </div>

    </div>
    </div>

    )
  }
}

export default AppUnlogged;
