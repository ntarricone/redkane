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
    this.notRegister = this.notRegister.bind(this)
    
  }


//CHANGE TO REGISTER COMPONENT
  notRegister() {
    this.setState(state => ({ isVisibleRegister: !state.isVisibleRegister }));
  }


  render(){
    const { isVisibleRegister } = this.state;
    return(

      <div className="AppUnloggedBackground">
    <div className="container-fluid AppUnloggedBackground">
        <div className="container">
        <div className="row centerForm">
      {/* <div className="col-sm-6 col-12 "><Register></Register></div> */}
      <div className="col-sm-6 col-12 ">
        {!isVisibleRegister && <Login notRegister= {this.notRegister}></Login>}
        {isVisibleRegister && <Register notRegister= {this.notRegister}></Register>}
        
        </div>
      <div className="col-sm-6 col-12"><img src={logoKane} alt=""/></div>
    
        </div>
        </div>


    </div>
    </div>

    )
  }
}

export default AppUnlogged;
