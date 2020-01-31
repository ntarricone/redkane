import React from "react";
import banner from "./banner.jpg";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetBannerAction, SetAvatarAction, SetAccountAction } from "../../../../redux/actions";

interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps {
  setBanner(banner: string): void;
  setAvatar(banner: string): void;
  setAccount(account: IAccount): void;
}

interface IState {
  banner: string;
  name: string | undefined;
  surname: string | undefined;
  profession: string | undefined;
  email: string | undefined;
  about_me: string | undefined;
  oldPassword: string;
  newPassword: string;
  youtube: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  avatarChosen: string;
  passwordMessage: string;
  updatedMessage: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UpdateProfile extends React.PureComponent<TProps, IState> {
  
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    const {account} = this.props;

    this.state = {
      banner: "",
      name: account?.name,
      surname: account?.surname,
      profession: account?.password,
      email: account?.email,
      about_me: account?.about_me,
      oldPassword: "",
      newPassword: "",
      youtube: "",
      twitter: "",
      facebook: "",
      linkedin: "",
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
      }).then(banner => {
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
      }).then(avatar => {
        console.log(avatar);
        if (avatar) {
          setAvatar(avatar);
        }
      });
      this.fileInputRef.current.value = "";
    }
  }

  updatePassword() {
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
      console.log(response)
      if (response) {
        console.log("actualizo pss");
        this.setState({passwordMessage: "Password updated correctly"});
      } else {
        console.log("no puedo");
        this.setState({ passwordMessage: "Please insert correct password" });
      }
    });
  }

  updateAccount() {
    const { account, setAccount } = this.props;
    const { id, token }: any = account;
    const {
      name,
      surname,
      profession,
      email,
      about_me,
      youtube,
      linkedin,
      twitter,
      facebook
    } = this.state;
  // let sendingEmail = email === null? account?.email: email;
  //TODO - FIX THIS.STATE WHEN BRINGING DATA FROM THE DATABASE
  // console.log(sendingEmail)
    myFetch({
      path: `/users/edit/${id}`,
      method: "PUT",
      json: {
        name,
        surname,
        profession,
        email,
        about_me,
        youtube,
        linkedin,
        twitter,
        facebook
      },
      token
    }).then(response => {
      console.log(response);
      if (response) {
        const {name, surname, profession, avatar, id, email, isAdmin, banner, about_me } = response;
        console.log("usuario actualizado");
        this.setState({updatedMessage: "User updated correctly"});
        setAccount({name, surname, profession, avatar, id, email, isAdmin, banner, about_me, token})
      } else {
        console.log("no actualizado");
        this.setState({updatedMessage: "Error updating details, please try again"});  
            
      }
    });
  }
  render() {
    const { account } = this.props;
    const {
      name,
      surname,
      profession,
      email,
      oldPassword,
      newPassword,
      about_me,
      youtube,
      linkedin,
      twitter,
      facebook
    } = this.state;
    const rojo = "red";
    return (
      <>
        <div className="container-fluid">
          {/* banner */}
          <div className="row">
            <div className="col-12" style={{ backgroundColor: `${rojo}` }}>
              {
                //TODO - have a look with Ruben cambiar backgroundColor por backgroundImage
              }
              <img className="banner" src={banner} alt="" />
              <br />
              <button>
                <i className="fas fa-upload" onClick={this.uploadBanner}></i>
              </button>
              <input type="file" ref={this.fileInputRef2} />
            </div>
          </div>
          <div className="row">
            <div className="col-3 mt-4">
              <img className="avatarProfile mb-1" src={banner} alt="" />
              <br />
              <button type="button" className="btn-sm btn-success">
                <i className="fas fa-upload" onClick={this.uploadAvatar}></i>
              </button>
              <input
                type="file"
                ref={this.fileInputRef}
                style={{ width: "14rem" }}
              />
            </div>
            <div className="col-5 mt-5">
              <div className="container">
                <div className="row centered-form">
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="row">
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control input-sm"
                              placeholder="First Name"
                              value={name}
                              onChange={({ target: { value } }) =>
                                this.setState({ name: value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xs-6 col-sm-6 col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control input-sm"
                              placeholder="Last Name"
                              value={surname? surname : account?.surname}
                              onChange={({ target: { value } }) =>
                                this.setState({ surname: value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control input-sm"
                          placeholder="Email Address"
                          value={email? email: account?.email}
                          onChange={({ target: { value } }) =>
                            this.setState({ email: value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control input-sm"
                          placeholder="Profession"
                          value={profession? profession: account?.profession}
                          onChange={({ target: { value } }) =>
                            this.setState({ profession: value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="col-4">
              <p>
                <button
                  className="btn btn-primary"
                  data-toggle="collapse"
                  data-target="#youtube"
                  aria-expanded="false"
                  aria-controls="youtube"
                >
                  Youtube
                </button>
                <button
                  className="btn btn-primary"
                  data-toggle="collapse"
                  data-target="#linkedin"
                  aria-expanded="false"
                  aria-controls="linkedin"
                >
                  Linkedin
                </button>
                <button
                  className="btn btn-primary"
                  data-toggle="collapse"
                  data-target="#twitter"
                  aria-expanded="false"
                  aria-controls="twitter"
                >
                  Twitter
                </button>
                <button
                  className="btn btn-primary"
                  data-toggle="collapse"
                  data-target="#facebook"
                  aria-expanded="false"
                  aria-controls="facebook"
                >
                  Facebook
                </button>
              </p>
              <div className="collapse" id="youtube">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={youtube}
                  onChange={({ target: { value } }) =>
                    this.setState({ youtube: value })
                  }
                />
              </div>
              <div className="collapse" id="linkedin">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={linkedin}
                  onChange={({ target: { value } }) =>
                    this.setState({ linkedin: value })
                  }
                />
              </div>
              <div className="collapse" id="twitter">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={twitter}
                  onChange={({ target: { value } }) =>
                    this.setState({ twitter: value })
                  }
                />
              </div>
              <div className="collapse" id="facebook">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={facebook}
                  onChange={({ target: { value } }) =>
                    this.setState({ facebook: value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <textarea
                placeholder="Write a description about you"
                className="form-control mt-3"
                value={about_me}
                onChange={({ target: { value } }: any) =>
                  this.setState({ about_me: value })
                }
              ></textarea>
              <button
                className="btn btn-info btn-block mt-3"
                onClick={this.updateAccount}
              >
                Update profile
              </button>
              <span>{this.state.updatedMessage}</span>
            </div>
            <div className="container-fluid">
              <div className="row mt-4">
                <div className="col-xs-3 col-sm-3 col-md-3">
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
                <div className="col-xs-3 col-sm-3 col-md-3">
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
                <div className="col-xs-2 col-sm-2 col-md-2">
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-success pr-4"
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
