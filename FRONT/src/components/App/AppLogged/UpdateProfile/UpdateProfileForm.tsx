import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetAccountAction } from "../../../../redux/actions";
import swal from "sweetalert";
import youtubeIcon from "../../../../icons/youtube2.png";
import linkedinIcon from "../../../../icons/linkedin2.png";

interface IProps {
  updateInFather({
    name,
    surname,
    profession
  }: {
    name: string;
    surname: string;
    profession: string;
  }): void;
}
interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

interface IState {
  name: string;
  surname: string;
  profession: string;
  about_me: string;
  oldPassword: string;
  isOldPasswordOk: boolean;
  newPassword: string;
  youtube: string;
  linkedin: string | undefined;
  passwordMessage: string;
  updatedMessage: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class UpdateProfileForm extends React.Component<TProps, IState> {
  constructor(props: any) {
    super(props);

    const { account } = this.props;

    this.state = {
      name: account.name,
      surname: account.surname,
      profession: account.profession,
      about_me: account.about_me,
      oldPassword: "",
      isOldPasswordOk: false,
      newPassword: "",
      youtube: account.youtube,
      linkedin: account.linkedin,
      passwordMessage: "",
      updatedMessage: ""
    };

    this.updateAccount = this.updateAccount.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.checkOldPassword = this.checkOldPassword.bind(this);
  }

  checkOldPassword() {
    const { oldPassword } = this.state;
    const token: any = localStorage.getItem("token");
    myFetch({
      path: `/users/checkOldPassword`,
      method: "POST",
      json: { oldPassword },
      token
    }).then(response => {
      if (response) {
        this.setState({ isOldPasswordOk: true });
      } else if (oldPassword !== "") {
        this.setState({
          passwordMessage: "Wrong password, please insert the right one"
        });
        setTimeout(
          () =>
            this.setState({
              passwordMessage: ""
            }),
          3000
        );
      }
    });
  }

  updatePassword() {
    //TODO - NOT WORKING
    const { account } = this.props;
    const { token }: any = account;
    const { newPassword } = this.state;
    myFetch({
      path: `/users/editPassword`,
      method: "POST",
      json: { newPassword },
      token
    }).then(response => {
      if (response) {
        swal({
          title: "Success!",
          text: "You´ve successfully updated your password",
          icon: "success",
          timer: 4000
        });
      } else {
        this.setState({
          passwordMessage: "There has been a problem, please try again"
        });
      }
      this.setState({ oldPassword: "", newPassword: "" });
    });
  }

  updateAccount() {
    const { account, setAccount } = this.props;
    const { id, token }: any = account;
    let { name, surname, profession, about_me, youtube, linkedin } = this.state;
    //If the state of the component is empty because there hasn´t been a change
    //I´m taking the value that comes from redux so it doesn´t update with empty strings
    name = name !== "" ? name : account.name;
    surname = surname !== "" ? surname : account.surname;
    profession = profession !== "" ? profession : account.profession;
    about_me = about_me !== "" ? about_me : account.about_me;
    youtube = youtube !== "" ? youtube : account.youtube;
    linkedin = linkedin !== "" ? linkedin : account.linkedin;
    myFetch({
      path: `/users/edit/${id}`,
      method: "PUT",
      json: { name, surname, profession, about_me, linkedin, youtube },
      token
    }).then(response => {
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
          youtube,
          isCreator
        } = response;
        swal({
          title: "Updated!",
          text: "User updated correctly",
          icon: "success",
          timer: 4000
        });
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
          linkedin,
          isCreator
        });
        console.log("entru")
        this.props.updateInFather({name, surname, profession});
      } else {
        this.setState({
          updatedMessage: "Error updating details, please try again"
        });
        setTimeout(() => this.setState({ updatedMessage: "" }), 3000);
      }
    });
  }

  render() {
    const { account } = this.props;
    let { isCreator } = account;
    isCreator = Boolean(isCreator);
    let {
      name = account?.name,
      surname,
      profession,
      oldPassword,
      newPassword,
      about_me,
      youtube,
      linkedin,
      passwordMessage,
      isOldPasswordOk
    } = this.state;

    return (
      <>
        {/* the form starts here */}
        <div className="container">
          <div className="row">
            <div className="col-2"></div>

            <div className="col-8 ml-1 animated zoomInUp ">
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
                              value={name}
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
                              value={surname}
                              onChange={({ target: { value } }) =>
                                this.setState({ surname: value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      {/* PROFESSION*/}
                      {isCreator && (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control input-sm"
                            placeholder="Profession"
                            value={profession}
                            onChange={({ target: { value } }) =>
                              this.setState({ profession: value })
                            }
                          />
                        </div>
                      )}
                      {/* ABOUT_ME */}
                      {isCreator && (
                        <textarea
                          placeholder="Write a description about you"
                          className="form-control mt-3"
                          value={about_me}
                          onChange={({ target: { value } }: any) =>
                            this.setState({ about_me: value })
                          }
                        ></textarea>
                      )}

                      {/* YOUTUBE */}
                      {isCreator && (
                        <div
                          className="row"
                          style={{ width: "100%", marginLeft: "0.2rem" }}
                        >
                          <img
                            src={youtubeIcon}
                            alt=""
                            style={{ width: "2rem" }}
                            className="mt-3"
                          />

                          <input
                            style={{ width: "93%" }}
                            placeholder="Youtube"
                            className="form-control mt-3 input-sm ml-2 "
                            type="text"
                            value={youtube}
                            onChange={({ target: { value } }) =>
                              this.setState({ youtube: value })
                            }
                          />
                        </div>
                      )}
                      {/* Linkedin */}
                      {isCreator && (
                        <div
                          className="row mt-3"
                          style={{ width: "100%", marginLeft: "0.2rem" }}
                        >
                          <img
                            src={linkedinIcon}
                            alt=""
                            style={{ width: "2rem", height: "2rem" }}
                          />
                          <input
                            style={{ width: "93%" }}
                            className="form-control input-sm ml-2"
                            placeholder="Linkedin"
                            type="text"
                            value={linkedin}
                            onChange={({ target: { value } }) =>
                              this.setState({ linkedin: value })
                            }
                          />
                        </div>
                      )}
                      <button
                        className="btn  btn-block mt-3 buttonColor"
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
                                this.setState({
                                  oldPassword: value,
                                  passwordMessage: "",
                                  isOldPasswordOk: false
                                })
                              }
                              onBlur={this.checkOldPassword}
                            />
                            <span className="text-danger">
                              {passwordMessage}
                            </span>
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
                          disabled={!isOldPasswordOk}
                          className="btn btn-block mt-1 mb-2 buttonColor passButton"
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
            <div className="col-2"></div>
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
  setAccount: SetAccountAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileForm);
