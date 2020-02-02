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
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UploadArticle from "./AppLogged/UploadArticle";
import Home from "./AppLogged/Home";
import Navbar from "../shared/Navbar/Navbar";


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
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const { id }: any = decode(token);
      setTimeout(()=>
      { this.restartAccount(id);}, 100);
      //TODO - FIX TIME OUT
      
    }
  }
  restartAccount(id: any) {
    const { setAccount } = this.props;

    myFetch({
      path: `/users/${id}`
    }).then(user => {
      if (user) {
        const token: any = localStorage.getItem("token");
        const {
          avatar,
          banner,
          surname,
          profession,
          about_me,
          name,
          id,
          email,
          isAdmin,
          youtube,
          linkedin
        } = user;
        setAccount({
          token,
          avatar,
          banner,
          name,
          surname,
          profession,
          about_me,
          id,
          email,
          isAdmin,
          youtube,
          linkedin
        });
      } else {
      }
    });
  }

  render() {
    const token = localStorage.getItem("token");
    return (
      <>

        <BrowserRouter>
        <Navbar></Navbar>
          <Switch> 

            <Route exact path="/">
              {!token && <AppUnlogged></AppUnlogged>}
              {token && <AppLogged></AppLogged>}
            </Route>

            <Route exact path="/uploadArticle">
              <UploadArticle type={"article"} />
            </Route>

            <Route exact path="/updateProfile">
              <UpdateProfile></UpdateProfile>
            </Route>
            
          </Switch>
        </BrowserRouter>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
