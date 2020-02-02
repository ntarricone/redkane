import React from "react";
import "./UpdateProfile.css";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IAccount } from "../../../../interfaces/IAccount";
import { myFetch } from "../../../../utils";
import { SetBannerAction, SetAvatarAction } from "../../../../redux/actions";
import { API_URL_IMAGES } from "../../../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import UserArticles from "./UserArticles";

interface IGlobalStateProps {
  account: IAccount;
}

interface IGlobalActionProps {
  setBanner(banner: string): void;
  setAvatar(banner: string): void;
}

interface IState {
  banner: string;
  avatarChosen: string;
  toggleContent: "edit" | "articles";
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UpdateProfile extends React.Component<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    this.state = {
      banner: "",
      avatarChosen: "",
      toggleContent: "edit"
    };

    this.fileInputRef = React.createRef();
    this.fileInputRef2 = React.createRef();
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
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

  render() {
    const { account } = this.props;
    const { avatar, banner } = account;
    const { toggleContent } = this.state;

    return (
      <>
        {/* banner + avatar */}
        <div className="container profileBackground">
          <div className="row">
            <div className="col-12 sharedBorder">
              {!banner ? (
                <img
                  className="banner mt-4"
                  src={API_URL_IMAGES + "defaultBanner.jpg"}
                  alt=""
                />
              ) : (
                <img
                  className="banner mt-4"
                  src={API_URL_IMAGES + banner}
                  alt=""
                />
              )}
              <br />
              <div className="container-fluid uploadBanner">
                <div className="row">
                  <div className="col-2"></div>
                  <div className="col-6 toggleIcons">
                    <i
                      className="far fa-newspaper iconsSize"
                      onClick={() => this.setState({ toggleContent: "articles" })}
                    ></i>
                    <i className="fas fa-camera iconsSize"></i>
                    <i className="fab fa-youtube iconsSize"></i>
                    <i
                      className="fas fa-user-cog mr-2  iconsSize"
                      onClick={() => this.setState({ toggleContent: "edit" })}
                    ></i>
                  </div>
                  <div className="col-2"></div>
                  <div className="col-2 text-right">
                    <label htmlFor="banner">
                      <i className="far fa-images iconsSize" 
                      data-toggle="tooltip" data-placement="top"
                      title="Update your banner"
                      ></i>
                       {/* TODO -fix tooltip desing */}
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
              {!avatar ? (
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
              <br />
              <label htmlFor="avatar">
                <i className="fas fa-plus-circle uploadAvatar iconsSize"></i>
              </label>
              <input
                id="avatar"
                style={{ display: "none" }}
                type="file"
                ref={this.fileInputRef}
                onChange={this.uploadAvatar}
              />
            </div>

            {toggleContent === "edit" && <UpdateProfileForm ></UpdateProfileForm>}
           {toggleContent === "articles" && <UserArticles></UserArticles>}
           {/* TODO - add images and movies */}
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
  setAvatar: SetAvatarAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
