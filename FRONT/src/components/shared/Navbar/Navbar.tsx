import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { IAccount } from "../../../interfaces/IAccount";
import "./Navbar.css";
import { LogoutAction } from "../../../redux/actions";

interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps {
  logout(): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class Navbar extends React.PureComponent<TProps> {
  constructor(props: TProps) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    const { logout } = this.props;
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    logout();
    
  }
  render() {
    const { account } = this.props;
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">
            Navbar w/ text
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto"></ul>
            <div className="dropdown">
              <img
                className="avatar"
                src={account?.avatar}
                alt=""
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              />
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <a className="dropdown-item" href="">
                  Action
                </a>
                <a className="dropdown-item" href="">
                  {!account?.avatar? <span>***</span>: ""}
                  Update your profile 
                  {/* TODO - add red asterix if avatar doesn´t exist */}
                </a>
                <a className="dropdown-item" href="" onClick={this.logout}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = ({ account }: IStore) => ({ account });

const mapDispatchToProps: IGlobalActionProps = {
  logout: LogoutAction
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
