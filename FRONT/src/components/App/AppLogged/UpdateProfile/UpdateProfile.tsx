import React from "react";
import banner from "./banner.jpg";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetBannerAction } from "../../../../redux/actions";

interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps{
  setBanner(banner: string): void;
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
  youtubeLink: string;
  twitterLink: string;
  facebookLink: string;
  linkedinLink: string;
  avatarChosen: string;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UpdateProfile extends React.PureComponent<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    this.state = {
      banner: "",
      name: "",
      surname: "",
      profession: "",
      email: "",
      about_me: "",
      oldPassword: "",
      newPassword: "",
      youtubeLink: "",
      twitterLink: "",
      facebookLink: "",
      linkedinLink: "",
      avatarChosen: ""
    };

    this.fileInputRef = React.createRef();
    this.fileInputRef2 = React.createRef();
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
  }

    //the uploads can be refactorised
  uploadBanner(){
    const { account, setBanner } = this.props;
    console.log(this.fileInputRef2.current)
    if (this.fileInputRef2.current?.files?.length && account) {
      console.log("oppaa")
      const { token } = account;
      const formData = new FormData();
      formData.append("file", this.fileInputRef2.current?.files[0]);
      myFetch({ method: "POST", path: `/users/uploadBanner`, token, formData }).then(
        banner => {
          if (banner) {
            setBanner(banner)
          }
        }
      );
      this.fileInputRef2.current.value = "";
    }

  }


  uploadAvatar(){
    const { account } = this.props;
    console.log("entro")
    console.log(account)
    if (this.fileInputRef.current?.files?.length && account) {
      const { token } = account;
      const formData = new FormData();
      formData.append("file", this.fileInputRef.current?.files[0]);
      myFetch({ method: "POST", path: `/users/uploadAvatar`, token, formData }).then(
        avatar => {
          if (avatar) {
            // setBanner(banner)
          }
        }
      );
      this.fileInputRef.current.value = "";
    }

  }
  render() {
    const {account} = this.props;
    const {
      name,
      surname,
      profession,
      email,
      oldPassword,
      newPassword,
      about_me,
      youtubeLink,
      linkedinLink,
      twitterLink,
      facebookLink
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
              <i className="fas fa-upload"
              onClick={this.uploadBanner}></i>
              </button>
              <input type="file" ref={this.fileInputRef2} />
              
            </div>
          </div>
          <div className="row">
            <div className="col-3 mt-4">
              <img className="avatarProfile mb-1" src={banner} alt="" />
              <br />
              <button type="button" className="btn-sm btn-success"><i className="fas fa-upload"
              onClick={this.uploadAvatar}></i></button>
              <input type="file" ref={this.fileInputRef} style={{width: "14rem"}}/>

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
                              value={surname}
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
                          value={email}
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
                          value={profession}
                          onChange={({ target: { value } }) =>
                            this.setState({ profession: value })
                          }
                        />
                      </div>

                      <div className="row">
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
                  value={youtubeLink}
                  onChange={({ target: { value } }) =>
                    this.setState({ youtubeLink: value })
                  }
                />
              </div>
              <div className="collapse" id="linkedin">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={linkedinLink}
                  onChange={({ target: { value } }) =>
                    this.setState({ linkedinLink: value })
                  }
                />
              </div>
              <div className="collapse" id="twitter">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={twitterLink}
                  onChange={({ target: { value } }) =>
                    this.setState({ twitterLink: value })
                  }
                />
              </div>
              <div className="collapse" id="facebook">
                <input
                  style={{ width: "62%" }}
                  type="text"
                  value={facebookLink}
                  onChange={({ target: { value } }) =>
                    this.setState({ facebookLink: value })
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
              className="btn btn-info btn-block mt-5"
                disabled={
                  name.length === 0 ||
                  surname.length === 0 ||
                  email.length === 0 ||
                  oldPassword === "" ||
                  newPassword === ""
                }
                // onClick={this.register}
                
              >
                Update profile
              </button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
