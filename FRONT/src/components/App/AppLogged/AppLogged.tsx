import React from 'react';

import Home from './Home';


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class AppLogged extends React.PureComponent<TProps>{
  render(){
    return(
      <>

      <Home></Home>
   
    
      </>
    )
  }
}

export default AppLogged;