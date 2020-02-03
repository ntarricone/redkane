import React from 'react';
import Register from './Register';
import "./AppUnlogged.css"
import Login from '../AppUnlogged/Login';
import logoKane from './logoKane.png'


interface IState {
  isVisibleRegister: boolean;
}
interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class AppUnlogged extends React.PureComponent<TProps, IState>{
  constructor(props: TProps) {
    super(props);
    this.state = {
      isVisibleRegister: false
    }
    this.notRegistered = this.notRegistered.bind(this)
    
  }


//CHANGE TO REGISTER/LOGIN COMPONENT
  notRegistered() {
    this.setState(state => ({ isVisibleRegister: !state.isVisibleRegister }));
  }


  render(){
    const { isVisibleRegister } = this.state;
    return(

    //   <div className="AppUnloggedBackground ">
    // <div className="container-fluid AppUnloggedBackground">
    <div className="patata">



  
        <div className="container ">
        <div className="row ">
      <div className="col-sm-6 col-12 loginContainer container">
        {!isVisibleRegister && <Login notRegistered= {this.notRegistered}></Login>}
        {isVisibleRegister && <Register notRegistered= {this.notRegistered}></Register>}
        
        </div>
      <div className="col-sm-6 col-12 logo"><img src={logoKane} alt=""/></div>
    
        </div>
        </div>
  <div className=" container-fuid appFooter static-bottom">
  <div className="row ">
          
              <div className="container text-light footer-copyright">
                 Redkane © 2020 Copyright  
              </div>
          </div>
      
  </div>

  </div>

    )
  }
}

export default AppUnlogged;
