import React from "react";
import "./App.css";
import AppUnlogged from "./AppUnlogged/AppUnlogged";
import { connect } from "react-redux";
import { SetAccountAction } from "../../redux/actions";
import { IStore } from "../../interfaces/IStore";
import { IAccount } from "../../interfaces/IAccount";
import { myFetch } from "../../utils";
import AppLogged from "./AppLogged/AppLogged";
import UpdateProfile from "./AppLogged/UpdateProfile/UpdateProfile";
import { decode } from "jsonwebtoken";
import { Switch, Route, Router } from "react-router-dom";
import UploadArticle from "./AppLogged/UploadArticle";
import Home from "./AppLogged/Home";
import Navbar from "../shared/Navbar/Navbar";
import history from "../../history"
import SingleMultimedia from "./AppLogged/MultimediaViews/SingleMultimedia/SingleMultimedia";
import RedkaneLive from "./AppLogged/RedkaneLive/RedkaneLive";
import ConfirmCreator from "./ConfirmCreator/ConfirmCreator";
import UserPurchases from "./AppLogged/UpdateProfile/UserPurchases/UserPurchases";



interface IProps  {
  
}
interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class App extends React.PureComponent<TProps> {
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
          linkedin,
          isCreator
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
          linkedin,
          isCreator
        });
      } else {
      }
    });
  }

  render() {
    const token = localStorage.getItem("token");
    return (
      <>

        <Router history={history}>
        {token && <Navbar></Navbar>}
          <Switch> 

            <Route exact path="/">
              {!token && <AppUnlogged></AppUnlogged>}
              {token && <AppLogged></AppLogged>}
            </Route>

            <Route path="/uploadArticle/:id">
              <UploadArticle type={"article"} />
            </Route>

            <Route exact path="/updateProfile/:id"  component ={UpdateProfile}>
            </Route>
            <Route path="/singleMultimedia/:id"  component ={SingleMultimedia}>
            </Route>
            <Route path="/redkaneLive/:id"  component ={RedkaneLive}>
            </Route>
            <Route path="/adminConfirmCreator/:id"  component ={ConfirmCreator}>
            </Route>
            <Route path="/userPurchases/:id"  component ={UserPurchases}>
            </Route>
            
          </Switch>
    
        </Router>
      
   
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
