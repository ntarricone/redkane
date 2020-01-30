import React from "react";
import "./App.css";
import AppUnlogged from "./AppUnlogged/AppUnlogged";
import { connect } from "react-redux";
import { SetAccountAction } from "../../redux/actions";
import { IStore } from "../../interfaces/IStore";
import { IAccount } from "../../interfaces/IAccount";
import { generateAccountFromToken } from "../../utils";
import AppLogged from "./AppLogged/AppLogged";

interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class App extends React.Component<TProps> {
  componentWillMount() {
    const { setAccount } = this.props;
    const token = localStorage.getItem("token");
    const avatar = localStorage.getItem("avatar");
    if (token) {
      setAccount(generateAccountFromToken(token, avatar));
    }
  }
  render() {
    const { account } = this.props;
    return (
      <>
       {!account && <AppUnlogged></AppUnlogged>} 
        {account && <AppLogged></AppLogged>}
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
