import React from "react";
import Register from "./Register";
import "./AppUnlogged.css";
import Login from "../AppUnlogged/Login";
import logoKane from "./logoKane.png";

interface IState {
  isVisibleRegister: boolean;
}
interface IGlobalStateProps {}

type TProps = IGlobalStateProps;

class AppUnlogged extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      isVisibleRegister: false
    };
    this.notRegistered = this.notRegistered.bind(this);
  }

  //CHANGE TO REGISTER/LOGIN COMPONENT
  notRegistered() {
    this.setState(state => ({ isVisibleRegister: !state.isVisibleRegister }));
  }

  render() {
    const { isVisibleRegister } = this.state;
    return (
      // <div className="unloggedContainer">
      //   <div className="container-fluid">
      //     <div className="row ">
      //       <div className="col-sm-6 col-12 loginContainer">
      //         {!isVisibleRegister && (
      //           <Login notRegistered={this.notRegistered}></Login>
      //         )}
      //         {isVisibleRegister && (
      //           <Register notRegistered={this.notRegistered}></Register>
      //         )}
      //       </div>
      //       <div className="col-sm-6 col-12 logo">
      //         <img src={logoKane} alt="" />
      //       </div>
      //     </div>
      //   </div>
      //   <div className=" container-fuid appFooter">
      //     <div className="row ">
      //       <div className="col-12">
      //       <p className="container text-light footer-copyright">
      //         Redkane © 2020 Copyright
      //       </p>
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 col-12"
            style={{marginTop: "18vh"}}>
              {!isVisibleRegister && (
                <Login notRegistered={this.notRegistered}></Login>
              )}
              {isVisibleRegister && (
                <Register notRegistered={this.notRegistered}></Register>
              )}
            </div>
            <div className="col-sm-6 col-12 mt-5">
              <img src={logoKane} alt="" />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row" style={{height: "28.2vh"}}>
            <div className="col-12"></div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12" 
            style={{backgroundColor: "#212121"}}>
              <p className="text-light text-center pt-2">Redkane © 2020 Copyright</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AppUnlogged;
