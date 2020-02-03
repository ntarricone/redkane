import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import {  SetAccountAction} from "../../../../redux/actions";
import swal from 'sweetalert';

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
  newPassword: string;
  youtube: string;
  linkedin: string | undefined;
  passwordMessage: string;
  updatedMessage: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

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
      newPassword: "",
      youtube: account.youtube,
      linkedin: account.linkedin,
      passwordMessage: "",
      updatedMessage: ""
    };

    this.updateAccount = this.updateAccount.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
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
        swal(
          {title: 'Updated!',
          text: 'User updated correctly',
          icon: "success",
          timer: 4000
        })
        // this.setState({ updatedMessage: "User updated correctly" });
        // setTimeout(() => {
        //   this.setState({ updatedMessage: "" });
        // }, 2000);
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

            {/* the form starts here */}
            <div className="col-6 mt-4 ml-1 animated zoomInUp ">
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
