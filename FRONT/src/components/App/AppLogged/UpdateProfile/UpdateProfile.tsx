import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import {
  SetBannerAction,
  SetAvatarAction,
  SetFilesAction
} from "../../../../redux/actions";
import { API_URL_IMAGES } from "../../../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import { IFiles } from "../../../../interfaces/IFiles";
import { IFile } from "../../../../interfaces/IFile";
import SettingUserFiles from "./SettingUserFiles/SettingUserFiles";
import history from "../../../../history";
import { decode } from "jsonwebtoken";
import BecomeCreator from "./BecomeCreator/BecomeCreator";
import MultimediaView from "../MultimediaViews/MultimediaView";
import UserPurchases from "./UserPurchases";

interface IProps {}
interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps {
  setBanner(banner: string): void;
  setAvatar(banner: string): void;
  setFiles(files: IFile[]): void;
}

interface IState {
  name: string;
  surname: string;
  profession: string;
  banner: string;
  avatar: string;
  avatarChosen: string;
  toggleContent: "edit" | "multimedia" | "purchases";
  isFound: boolean;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class UpdateProfile extends React.PureComponent<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      surname: "",
      profession: "",
      banner: "",
      avatar: "",
      avatarChosen: "",
      toggleContent: "multimedia",
      isFound: true
    };

    this.fileInputRef = React.createRef();
    this.fileInputRef2 = React.createRef();
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
    this.setUserProfile = this.setUserProfile.bind(this);
    this.changeIsFoundToFalse = this.changeIsFoundToFalse.bind(this);
    this.changeIsFoundToTrue = this.changeIsFoundToTrue.bind(this);
    this.updateInFather = this.updateInFather.bind(this);
  }

  componentDidMount() {
    this.setUserProfile();
  }

  changeIsFoundToFalse() {
    this.setState({ isFound: false });
  }

  changeIsFoundToTrue() {
    this.setState({ isFound: true });
  }

  setUserProfile() {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        myFetch({ path: `/users/${this.userId}`, token }).then(response => {
          if (response) {
            this.setState(response);
          }
        });
      })();
    }
  }

  uploadBanner() {
    const { account, setBanner } = this.props;
    if (this.fileInputRef2.current?.files?.length && account) {
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
          this.setState({ banner: banner });
          setBanner(banner);
        }
      });
      this.fileInputRef2.current.value = "";
    }
  }

  uploadAvatar() {
    const { account, setAvatar } = this.props;
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
          this.setState({ avatar: avatar });
          setAvatar(avatar);
        }
      });
      this.fileInputRef.current.value = "";
    }
  }

  updateInFather({
    name,
    surname,
    profession
  }: {
    name: string;
    surname: string;
    profession: string;
  }) {
    console.log("entramos");
    this.setState({ name, surname, profession });
  }

  render() {
    const { account, files } = this.props;
    const { toggleContent, banner, avatar, isFound } = this.state;
    const token: any = localStorage.getItem("token");
    const { id }: any = decode(token);

    return (
      <>
        {/* banner + avatar */}
        <div className="container profileBackground ">
          <div className="row ">
            <div className="col-12 sharedBorder mt-5">
              {/* UPLOAD BANNER  */}
              {!banner ? (
                <div
                  className="banner mt-3"
                  style={{
                    backgroundImage: `url(${API_URL_IMAGES +
                      "defaultBanner.jpg"})`
                  }}
                >
                  {" "}
                  {id == this.userId && (
                    <button
                      className="btn btn-sm"
                      style={{ height: "2rem", width: "2.5rem" }}
                    >
                      <label htmlFor="myBanner">
                        <i
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Update your banner"
                          className="fas fa-images iconsSize"
                          style={{ backgroundColor: "white", width: "1.9rem" }}
                        ></i>
                      </label>
                      <input
                        onChange={this.uploadBanner}
                        type="file"
                        id="myBanner"
                        style={{ display: "none" }}
                        ref={this.fileInputRef2}
                      />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="banner mt-3"
                  style={{ backgroundImage: `url(${API_URL_IMAGES + banner})` }}
                >
                  {" "}
                  {id == this.userId && (
                    <button
                      className="btn"
                      style={{ height: "2rem", width: "2.5rem" }}
                    >
                      <label htmlFor="myBanner">
                        <i
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Update your banner"
                          className="fas fa-images iconsSize"
                          style={{ backgroundColor: "white", width: "1.9rem" }}
                        ></i>
                      </label>
                      <input
                        onChange={this.uploadBanner}
                        type="file"
                        id="myBanner"
                        style={{ display: "none" }}
                        ref={this.fileInputRef2}
                      />
                    </button>
                  )}
                </div>
              )}
              <br />
            </div>
          </div>
          {/* Options bar */}
          <div className="container-fluid uploadBanner">
            <div className="row">
              <div className="col-2">
                {!avatar && !account.isAdmin ? (
                  <img
                    className="avatarProfile mb-1"
                    src={API_URL_IMAGES + "avatar.png"}
                    alt=""
                  />
                ) : (
                  <img
                    className="avatarProfile mb-1"
                    src={API_URL_IMAGES + avatar}
                    alt=""
                  />
                )}
                {!avatar && account.isAdmin ? (
                  <img
                    className="avatarProfile mb-1"
                    src={API_URL_IMAGES + "RKLcubo.png"}
                    alt=""
                  />
                ) : (
                  <img
                    className="avatarProfile mb-1"
                    src={API_URL_IMAGES + avatar}
                    alt=""
                  />
                )}
                {id == this.userId && (
                  <div>
                    <label htmlFor="avatar">
                      <i
                        style={{
                          backgroundColor: "white",
                          width: "27px",
                          height: "27px",
                          borderRadius: "50%"
                        }}
                        className="fas fa-plus-circle uploadAvatar iconsSize"
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
                )}
              </div>
              <div className="col-sm-3 col-12 responsiveName">
                <h4>{this.state.name + " " + this.state.surname}</h4>
                <span>{this.state.profession}</span>
                {/* add user details */}
              </div>
              <div className="col-sm-4 col-12"></div>
              {/* Upload Banner */}
              {id == this.userId && (
                <div
                  className="col-sm-3 col-12 mt-2"
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly"
                  }}
                >
                  {id == this.userId && (
                    <button className="btn " style={{ height: "0px" }}>
                      <i
                        className="fas fa-photo-video iconsSize"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="See all multimedia"
                        onClick={() => {
                          this.setState({ toggleContent: "multimedia" });
                          this.setState({ isFound: true });
                        }}
                      ></i>
                    </button>
                  )}
                  {id == this.userId && (
                    <button className="btn btn-sm" style={{ height: "0px" }}>
                      <i
                        className="fas fa-user-cog iconsSize"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Update your details"
                        onClick={() => {
                          this.setState({ toggleContent: "edit" });
                          this.setState({ isFound: true });
                        }}
                      ></i>
                    </button>
                  )}

                  {id == this.userId && !account.isCreator && (
                    <button className="btn btn-sm" style={{ height: "0px" }}>
                      <i
                        className="fas fa-shopping-bag iconsSize"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="See your purchases"
                        onClick={() =>
                          this.setState({ toggleContent: "purchases" })
                        }
                      ></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="container mt-5">
            <div className="row">
              <div className="col-12">
                {toggleContent === "multimedia" &&
                (id != this.userId || account.isCreator) ? (
                  <SettingUserFiles
                    changeIsFoundToFalse={this.changeIsFoundToFalse}
                    changeIsFoundToTrue={this.changeIsFoundToTrue}
                  ></SettingUserFiles>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* Show CARDS or BECOME CREATOR */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {toggleContent === "multimedia" &&
                  ((account.isCreator && id == this.userId) ||
                  id != this.userId ? (
                    <div className="container">
                      <div className="row">
                        {files.order.map(id => (
                          <div key={id} className="col-sm-6 col-md-4 col-12 ">
                            <MultimediaView
                              file={files.byId[+id]}
                            ></MultimediaView>
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className=" text-center mt-3 createYourContentDiv  "
                      style={{ height: "35vh", color: "#e51428" }}
                    >
                      <h1 className="animated rotateInDownLeft">
                        Why not create your own content?{" "}
                      </h1>
                      <br />
                      <h1 className="animated rotateInDownRight">
                        {" "}
                        Apply to become a Kaner
                      </h1>
                      <button
                        data-toggle="modal"
                        data-target="#becomeCreator"
                        className="btn btn-block mt-1 mb-2 buttonColor mt-3 animated bounceInUp"
                        style={{ width: "30%" }}
                      >
                        Yes, please!
                      </button>
                    </div>
                  ))}

                <BecomeCreator id={id}></BecomeCreator>

                {/* Sow User Form */}

                {toggleContent === "edit" && (
                  <UpdateProfileForm
                    updateInFather={this.updateInFather}
                  ></UpdateProfileForm>
                )}
                {/* Shows User Purchases before becoming a Creator */}
                {toggleContent === "purchases" && (
                  <UserPurchases
                    changeIsFoundToFalse={this.changeIsFoundToFalse}
                    changeIsFoundToTrue={this.changeIsFoundToTrue}
                  ></UserPurchases>
                )}
                {!isFound && (
                  <div className="animated zoomIn">
                    <h3 style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ account, files }: IStore): IGlobalStateProps => ({
  account,
  files
});

const mapDispatchToProps: IGlobalActionProps = {
  setBanner: SetBannerAction,
  setAvatar: SetAvatarAction,
  setFiles: SetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
