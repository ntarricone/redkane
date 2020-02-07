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
import UserArticles from "./UserArticles";
import { IFiles } from "../../../../interfaces/IFiles";
import { IFile } from "../../../../interfaces/IFile";
import Filter from "../../../shared/Filter/Filter";
import SettingUserFiles from "./SettingUserFiles/SettingUserFiles";
import history from "../../../../history";
import upload from "../../../../icons/upload.png";
import video from "../../../../icons/video.png";
import user from "../../../../icons/user.png";
import {decode} from 'jsonwebtoken';

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
  banner: string;
  avatarChosen: string;
  toggleContent: "edit" | "multimedia";
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class UpdateProfile extends React.Component<TProps, IState> {
  userId = history.location.pathname.split("/").slice(-1)[0];
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef2: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);

    this.state = {
      banner: "",
      avatarChosen: "",
      toggleContent: "multimedia"
    };

    this.fileInputRef = React.createRef();
    this.fileInputRef2 = React.createRef();
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.uploadBanner = this.uploadBanner.bind(this);
  }

  uploadBanner() {
    const { account, setBanner } = this.props;
    // console.log("entroooooooo");
    console.log(this.fileInputRef2.current);
    console.log(account);
    if (this.fileInputRef2.current?.files?.length && account) {
      // console.log("oppaa");
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
    // console.log("entro");
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
    const { account, files } = this.props;
    const { avatar, banner } = account;
    const { toggleContent } = this.state;
    const token: any = localStorage.getItem("token");
    const {id}: any = decode(token);
   
    
    

    return (
      <>
        {/* banner + avatar */}
        <div className="container profileBackground ">
          <div className="row ">
            <div className="col-12 sharedBorder mt-5">
              {!banner ? (
                
                <div className="banner mt-3"
                style={{ backgroundImage: `url(${API_URL_IMAGES + "defaultBanner.jpg"})` }}
                ></div>
              ) : (
                <div className="banner mt-3"
                style={{ backgroundImage: `url(${API_URL_IMAGES + banner})` }}
                ></div>
 
              )}
              <br />
              <div className="container-fluid uploadBanner">
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5 toggleIcons">
                  {id == this.userId && <img
                      className="iconsSize"
                      src={video}
                      alt=""
                      onClick={() =>
                        this.setState({ toggleContent: "multimedia" })
                      }
                    />}
                    {id == this.userId && <img
                      className="iconsSize"
                      src={user}
                      alt=""
                      onClick={() => this.setState({ toggleContent: "edit" })}
                    />}
                  </div>
                  {/* Upload Banner */}
                  <div className="col-3"></div>
                  {id == this.userId && <div className="col-3 text-right">
                    <label htmlFor="banner">
                      <img className="iconsSize" src={upload} alt="" />
                      {/* TODO -fix tooltip desing */}
                    </label>
                    <input
                      onChange={this.uploadBanner}
                      type="file"
                      id="banner"
                      style={{ display: "none" }}
                      ref={this.fileInputRef2}
                    />
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="row sharedBorder mt-3">
           <div className="col-2">
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
              {id == this.userId && <div>
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
              </div>}
            </div>
            <div className="row ">
              <div className="col-12 d-flex justify-content-center mt-4"></div>
            </div>
            {toggleContent === "multimedia" && (
              <SettingUserFiles></SettingUserFiles>
            )}
            {toggleContent === "edit" && (
              <UpdateProfileForm></UpdateProfileForm>
            )}
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
