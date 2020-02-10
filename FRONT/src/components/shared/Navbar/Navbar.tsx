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
import ContentUploader from "../ContentUploader/ContentUploader";
import { decode }from 'jsonwebtoken';
import home from "../../../icons/home.png";

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
    const token: any = localStorage.getItem("token");
    const { id }: any = decode(token)
 
    return (
      <>
        <nav
          style={{ height: "7vh" }}
          className="navbar navbar-expand-lg navbar-light navbarBackground"
        >
          <Link to="/" className="navbar-brand" href="#">
            <img
              style={{ height: "6vh" }}
              src={home}
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
            <Link to={`/redkaneLive/${account?.id}`} className="navbar-brand" href="#">
            <img
              style={{ height: "6vh" }}
              src={API_URL_IMAGES + "logoKane2.png"}
              alt=""
            />
          </Link>
            <span className="mr-3">{account?.email}</span>
            {/* <ContentUploader></ContentUploader> */}
            <div className="dropdown">
            {! account?.avatar ? (
                <img
                style={{ height: "6vh", width: "3vw", borderRadius: "50%" }}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                src={API_URL_IMAGES + "avatar.png"}
                />
              ) : (
                <img
                style={{ height: "6vh", width: "3vw", borderRadius: "50%" }}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                src={API_URL_IMAGES + account?.avatar}
              ></img>
              )}


              <div className="dropdown" aria-labelledby="dropdownMenuButton">
              <div className="dropdown-content">
                <div>
                {/* <a href="">Action</a> */}
                </div>
                <div>
                <a href="" onClick={history.push(`/updateProfile/${id}`)}>
                   {!account?.avatar && <span className="text-danger">***</span>}
                  Update your profile
                </a>
                  {/* TODO - add red asterix if avatar doesn´t exist */}
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
