import React from "react";
import "./App.css";
import AppUnlogged from "./AppUnlogged/AppUnlogged";
import { connect } from "react-redux";
import { SetAccountAction } from "../../redux/actions";
import { IStore } from "../../interfaces/IStore";
import { IAccount } from "../../interfaces/IAccount";
import { generateAccountFromToken, myFetch } from "../../utils";
import AppLogged from "./AppLogged/AppLogged";
import UpdateProfile from "./AppLogged/UpdateProfile/UpdateProfile";
import { decode } from "jsonwebtoken";

interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class App extends React.Component<TProps> {
  constructor(props: any) {
    super(props);

    this.restartAccount = this.restartAccount.bind(this);
  }
  componentWillMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const { id }: any = decode(token);
      this.restartAccount(id);
    }
  }

  restartAccount(id: any){
    const { setAccount } = this.props;
    
    myFetch({
      path: `/users/${id}`,
    }).then(user => {
      if (user) {
        const token: any = localStorage.getItem("token");
        const { avatar, banner, surname, profession, about_me, name, password, id, email, isAdmin } = user;
        setAccount({token, avatar, banner, name, surname, profession, password, about_me, id, email, isAdmin});
        
      } else {

      }
    });
  }

  render() {

    const token = localStorage.getItem("token");

    return (
      <>
       {!token && <AppUnlogged></AppUnlogged>} 
        {token && <UpdateProfile></UpdateProfile>}
        {token && <AppLogged></AppLogged>}
      </>
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {
  setAccount: SetAccountAction
};

export default connect(mapStateToProps , mapDispatchToProps)(App);
