import React from "react";
import banner from "./banner.jpg";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import {
  SetBannerAction,
  SetAvatarAction,
  SetAccountAction
} from "../../../../redux/actions";
import { API_URL_IMAGES } from "../../../../constants";

interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setBanner(banner: string): void;
  setAvatar(banner: string): void;
  setAccount(account: IAccount): void;
}

interface IState {
  banner: string;
  name: string;
  surname: string;
  profession: string;
  email: string;
  about_me: string;
  oldPassword: string;
  newPassword: string;
  youtube: string;
  linkedin: string | undefined;
  avatarChosen: string;
  passwordMessage: string;
  updatedMessage: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UpdateProfile extends React.Component<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    const { account } = this.props;

    this.state = {
      banner: "",
      name: account.name,
      surname: account.surname,
      profession: account.profession,
      email: account.email,
      about_me: account.about_me,
      oldPassword: "",
      newPassword: "",
      youtube: account.youtube,
      linkedin: account.linkedin,
      avatarChosen: "",
      passwordMessage: "",
      updatedMessage: ""
    };

    this.fileInputRef = React.createRef();
    this.fileInputRef2 = React.createRef();
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  uploadBanner() {
    const { account, setBanner } = this.props;
    console.log("entroooooooo");
    console.log(this.fileInputRef2.current);
    console.log(account);
    if (this.fileInputRef2.current?.files?.length && account) {
      console.log("oppaa");
      const { token } = account;
      const formData = new FormData();
      formData.append("file", this.fileInputRef2.current?.files[0]);
      myFetch({
        method: "POST",
        path: `/users/uploadBanner`,
        token,
        formData
      }).then(({ banner }) => {
        if (banner) {
          setBanner(banner);
        }
      });
      this.fileInputRef2.current.value = "";
    }
  }

  uploadAvatar() {
    const { account, setAvatar } = this.props;
    console.log("entro");
    console.log(account);
    if (this.fileInputRef.current?.files?.length && account) {
      const { token } = account;
      const formData = new FormData();
      formData.append("file", this.fileInputRef.current?.files[0]);
      myFetch({
        method: "POST",
        path: `/users/uploadAvatar`,
        token,
        formData
      }).then(({ avatar }) => {
        if (avatar) {
          setAvatar(avatar);
        }
      });
      this.fileInputRef.current.value = "";
    }
  }

  updatePassword() {
    //TODO - NOT WORKING
    this.setState({ passwordMessage: "" });
    const { account } = this.props;
    const { id, token }: any = account;
    const { oldPassword, newPassword } = this.state;
    myFetch({
      path: `/users/editPassword/${id}`,
      method: "PUT",
      json: { oldPassword, newPassword },
      token
    }).then(response => {
      console.log(response);
      if (response) {
        console.log("actualizo pss");
        this.setState({ passwordMessage: "Password updated correctly" });
      } else {
        console.log("no puedo");
        this.setState({ passwordMessage: "Please insert correct password" });
      }
    });
  }

  updateAccount() {
    const { account, setAccount } = this.props;
    const { id, token }: any = account;
    let { name, surname, profession, about_me, youtube, linkedin } = this.state;
    //If the state of the component is empty because there hasn´t been a change
    //I´m taking the value that comes from redux so it doesn´t update with empty strings
    name = name != "" ? name : account.name;
    surname = surname != "" ? surname : account.surname;
    profession = profession != "" ? profession : account.profession;
    about_me = about_me != "" ? about_me : account.about_me;
    youtube = youtube != "" ? youtube : account.youtube;
    linkedin = linkedin != "" ? linkedin : account.linkedin;
    myFetch({
      path: `/users/edit/${id}`,
      method: "PUT",
      json: { name, surname, profession, about_me, linkedin, youtube },
      token
    }).then(response => {
      console.log(response);
      if (response) {
        const {
          name,
          surname,
          profession,
          avatar,
          id,
          email,
          isAdmin,
          banner,
          about_me,
          linkedin,
          youtube
        } = response;
        console.log("usuario actualizado");
        this.setState({ updatedMessage: "User updated correctly" });
        setTimeout(() => {
          this.setState({ updatedMessage: "" });
        }, 2000);
        setAccount({
          name,
          surname,
          profession,
          avatar,
          id,
          email,
          isAdmin,
          banner,
          about_me,
          token,
          youtube,
          linkedin
        });
      } else {
        console.log("no actualizado");
        this.setState({
          updatedMessage: "Error updating details, please try again"
        });
      }
    });
  }

  render() {
    const { account } = this.props;
    const {avatar, banner} = account;
    let {
      name = account?.name,
      surname,
      profession,
      oldPassword,
      newPassword,
      about_me,
      youtube,
      linkedin
    } = this.state;

    return (
      <>
        {/* banner + avatar */}
        <div className="container profileBackground">
          <div className="row">
            <div className="col-12 sharedBorder" >
              {!banner?
              <img
              className="banner mt-4"
              src={API_URL_IMAGES + "defaultBanner.jpg"}
              alt=""
            />
              : <img
              className="banner mt-4"
              src={API_URL_IMAGES + banner}
              alt=""
            />
            }
              <br />
              <div className="container uploadBanner ml-4">
                <div className="">
                  <div className="col-12 ">
                    <label htmlFor="banner">
                      <i
                        className="far fa-images "
                        style={{ fontSize: "30px" }}
                      ></i>
                    </label>
                    <input
                      onChange={this.uploadBanner}
                      type="file"
                      id="banner"
                      style={{ display: "none" }}
                      ref={this.fileInputRef2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row sharedBorder mt-3">
            <div className="col-2 mt-3">
              {!avatar?
              <img
                className="avatarProfile mb-1"
                src={API_URL_IMAGES + "defaultAvatar.png"}
                alt=""
              />:
              <img
                className="avatarProfile mb-1"
                src={API_URL_IMAGES + avatar}
                alt=""
              />
              }
              <br />
              <label htmlFor="avatar">
                <i
                  className="fas fa-plus-circle uploadAvatar"
                  style={{ fontSize: "30px" }}
                ></i>
              </label>
              <input
                id="avatar"
                style={{ display: "none" }}
                type="file"
                ref={this.fileInputRef}
                onChange={this.uploadAvatar}
              />
            </div>

            {/* the form starts here */}
            <div className="col-6 mt-4 ml-1">
              <div className="container">
                <div className="row centered-form">
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="row">
                        {/* FIRST NAME */}
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control input-sm"
                              placeholder="First Name"
                              value={name ? name : account.name}
                              onChange={({ target: { value } }) =>
                                this.setState({ name: value })
                              }
                            />
                          </div>
                        </div>
                        {/* SURNAME */}
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control input-sm"
                              placeholder="Last Name"
                              value={surname ? surname : account.surname}
                              onChange={({ target: { value } }) =>
                                this.setState({ surname: value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      {/* PROFESSION*/}
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control input-sm"
                          placeholder="Profession"
                          value={profession ? profession : account.profession}
                          onChange={({ target: { value } }) =>
                            this.setState({ profession: value })
                          }
                        />
                      </div>
                      {/* ABOUT_ME */}
                      <textarea
                        placeholder="Write a description about you"
                        className="form-control mt-3"
                        value={about_me ? about_me : account.about_me}
                        onChange={({ target: { value } }: any) =>
                          this.setState({ about_me: value })
                        }
                      ></textarea>

                      <button
                        className="btn btn-success btn-block mt-3"
                        onClick={this.updateAccount}
                      >
                        Update profile
                      </button>
                      <span>{this.state.updatedMessage}</span>

                      <div className="row mt-4">
                        {/* OLD PASSWORD */}
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control input-sm"
                              placeholder="Old password"
                              value={oldPassword}
                              onChange={({ target: { value } }) =>
                                this.setState({ oldPassword: value })
                              }
                            />
                          </div>
                        </div>
                        {/* NEW PASSWORD */}
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control input-sm"
                              placeholder="New password"
                              value={newPassword}
                              onChange={({ target: { value } }) =>
                                this.setState({ newPassword: value })
                              }
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-success btn-block mt-1 mb-2 passButton"
                          onClick={this.updatePassword}
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="col-3 mt-3">
              {/* YOUTUBE */}
              <input
                className="form-control input-sm socialInput"
                placeholder="Youtube"
                style={{ width: "62%" }}
                type="text"
                value={youtube? youtube: account.youtube}
                onChange={({ target: { value } }) =>
                  this.setState({ youtube: value })
                }
              />
              <i className="fab fa-youtube"></i>

              {/* LINKEDIN */}
              <input
                className="form-control input-sm mt-2 socialInput"
                placeholder="Linkedin"
                style={{ width: "62%" }}
                type="text"
                value={linkedin? linkedin : account.linkedin}
                onChange={({ target: { value } }) =>
                  this.setState({ linkedin: value })
                }
              />
              <i className="fab fa-linkedin"></i>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {
  setBanner: SetBannerAction,
  setAvatar: SetAvatarAction,
  setAccount: SetAccountAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
