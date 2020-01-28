import React from 'react';
import Login from '../Login';


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class AppUnlogged extends React.PureComponent<TProps>{
  render(){
    return(
      <>
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <Login></Login>
            </div>
        </div>
        <div className="row">
            <div className="col-6"></div>
            <div className="col-6">
                Hola
            </div>
        </div>
    </div>
    
      </>
    )
  }
}

export default AppUnlogged;
