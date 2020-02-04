import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { IAccount } from "../../../interfaces/IAccount";
import "./Navbar.css";
import { LogoutAction } from "../../../redux/actions";
import { Link } from "react-router-dom";
import { API_URL_IMAGES } from "../../../constants";
import { Router } from "react-router-dom";
import history from "../../../history";

interface IProps {}
interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps {
  logout(): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

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
    history.push("/");
  }
  render() {
    const { account } = this.props;
    return (
      <>
        <nav
          style={{ height: "7vh" }}
          className="navbar navbar-expand-lg navbar-light navbarBackground"
        >
          <Link to="/" className="navbar-brand" href="#">
            <img
              style={{ height: "6vh" }}
              src={API_URL_IMAGES + "logoKane2.png"}
              alt=""
            />
          </Link>
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
                style={{ height: "6vh", width: "3vw", borderRadius: "50%" }}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                src={API_URL_IMAGES + account?.avatar}
              ></img>
              {/* <img
                className="avatar"
                src={account?.avatar}
                alt=""
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              /> TODO - ADD IMG*/}
              <div className="dropdown" aria-labelledby="dropdownMenuButton">
              <div className="dropdown-content">
                <div>
                <a href="">Action</a>
                </div>
                <div>
                <Link to="/updateProfile">
                  {!account?.avatar ? <span>***</span> : ""}
                  Update your profile
                  {/* TODO - add red asterix if avatar doesn´t exist */}
                </Link>
                </div>
                <div>
                <a href="" onClick={this.logout}>
                  Logout
                </a>
                </div>
                </div>
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
