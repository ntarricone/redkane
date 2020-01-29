import React from 'react';
import Navbar from '../../shared/Navbar/Navbar';
import Home from './Home';


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class AppLogged extends React.PureComponent<TProps>{
  render(){
    return(
      <>
      <Navbar></Navbar>
      <Home></Home>
   
    
      </>
    )
  }
}

export default AppLogged;