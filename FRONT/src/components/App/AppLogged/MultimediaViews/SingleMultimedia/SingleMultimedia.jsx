import React from "react";
import { connect } from "react-redux";
import { myFetch, getYoutubeId } from "../../../../../utils";
import { API_URL_MULTIMEDIA, API_URL_IMAGES } from "../../../../../constants";
import "./SingleMultimedia.css";
import ReactHtmlParser from "react-html-parser";
import {
  SetChosenFileAction,
  DeleteFileAction,
  UnsetFilesAction
} from "../../../../../redux/actions";
import { IFile } from "../../../../../interfaces/IFile";
import { decode } from "jsonwebtoken";
import { Link } from "react-router-dom";
import linkedinIcon from "../../../../../icons/linkedin2.png";
import youtubeIcon from "../../../../../icons/youtube2.png";
import deleteIcon from "../../../../../icons/trash.png";
import editIcon from "../../../../../icons/edit.png";
import swal from "sweetalert";
import history from "../../../../../history";
import logoKane from "../../../../../images/logoKane.png";
import YouTube from "react-youtube";
import { PayPalButton } from "react-paypal-button-v2";

class SingleMultimedia extends React.PureComponent {
  id_multimedia = this.props.match.params.id;
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      time: "",
      path: "",
      type: "",
      price: null,
      category: "",
      language: "",
      views: null,
      reading_time: "",
      description: "",
      textArea: "",
      id: null,
      name: "",
      surname: "",
      avatar: "",
      email: "",
      youtube: "",
      linkedin: "",
      isVideoTimeUp: false,
      loggedId: 0,
      isPurchased: false
    };
    this.setFile = this.setFile.bind(this);
    this.setUser = this.setUser.bind(this);
    this.deleteMultimedia = this.deleteMultimedia.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.setPurchaseStatus = this.setPurchaseStatus.bind(this);
    this.savePurchaseInDDBB = this.savePurchaseInDDBB.bind(this);
  }

  componentDidMount() {
    this.setFile();
    const token = localStorage.getItem("token");
    this.setPurchaseStatus(token);
    const { id: loggedId } = decode(token);
    this.setState({ loggedId });
  }

  setFile() {
    console.log(this.props.files.chosenFile);
    if (this.props.files.chosenFile.multimediaId !== 0) {
      const {
        title,
        time,
        path,
        type,
        price,
        category,
        language,
        views,
        reading_time,
        description,
        textArea,
        id
      } = this.props.files.chosenFile;
      this.setState({
        title,
        time,
        path,
        type,
        price,
        category,
        language,
        views,
        reading_time,
        description,
        textArea,
        id
      });
      this.setUser(id);
    } else {
      setTimeout(
        (token = localStorage.getItem("token")) =>
          myFetch({
            path: `/multimedia/single/${this.id_multimedia}`,
            token
          }).then(file => {
            console.log(file);
            if (file) {
              const {
                title,
                time,
                path,
                type,
                price,
                category,
                language,
                views,
                reading_time,
                description,
                textArea,
                id
              } = file;
              this.setState({
                title,
                time,
                path,
                type,
                price,
                category,
                language,
                views,
                reading_time,
                description,
                textArea,
                id
              });
              this.props.setChosenFile(file);
              this.setUser(id);
            }
          }),
        200
      );
    }
  }

  setPurchaseStatus(token) {
    myFetch({
      path: `/multimedia/isPurchased/${this.id_multimedia}`,
      token
    }).then(response => {
      console.log(response);
      if (response) this.setState({ isPurchased: response });
    });
  }

  deleteMultimedia(id_multimedia) {
    swal({
      title: "Are you sure?",
      text: "By clicking ok you will delete this file permanently",
      icon: "warning",
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        const token = localStorage.getItem("token");
        myFetch({
          path: `/multimedia/delete/${id_multimedia}`,
          method: "DELETE",
          token
        }).then(response => {
          console.log(response);
          if (response) {
            this.props.unsetFiles();
            swal("Deleted!", "Your multimedia has been deleted!", "success");
            history.push(`/`);
          }
        });
      }
    });
  }

  setUser(id) {
    myFetch({ path: `/users/${id}` }).then(user => {
      if (user) {
        console.log(user);
        const { name, surname, email, avatar, youtube, linkedin } = user;
        this.setState({ name, surname, email, avatar, youtube, linkedin });
      }
    });
  }

  //YOUTUBE EVENT FUNCTIONS

  //plays a video and stops it if !free && !owner | NOT PURCHASED (TODO)
  playVideo(event) {
    const { price, loggedId, id, isPurchased } = this.state;
    this.setState({ isVideoTimeUp: false });
    console.log(this.state.isVideoTimeUp);
    if (price !== 0 && loggedId !== id && !isPurchased) {
      setTimeout(() => {
        event.target.stopVideo();
        this.setState({ isVideoTimeUp: true });
        console.log(this.state.isVideoTimeUp);
      }, 1000);
    }
  }

  savePurchaseInDDBB(paypalId) {
    const token = localStorage.getItem("token");
    myFetch({
      path: `/multimedia/addPurchase/${this.id_multimedia}`,
      method: "POST",
      json: { paypalId },
      token
    }).then(this.setState({ isPurchased: true, isVideoTimeUp: false }));
    //TODO - SEND EMAIL TO CREATOR
    //WHAT ABOUT AN EMAIL TO THE BUYER?
  }

  render() {
    const {
      textArea,
      description,
      name,
      surname,
      youtube,
      linkedin,
      time,
      id: idCreator,
      type,
      loggedId,
      isPurchased,
      loading
    } = this.state;
    let { avatar, path, title, price, isVideoTimeUp } = this.state;
    title = title ? title : "Title missing :(";
    avatar = avatar ? avatar : "avatar.png";
    path = path ? path : "defaultBanner.jpg"; //setting default img if no img provided

    //youtube video configuration
    const opts = {
      height: "400",
      width: "900"
    };

    return (
      <>
        {/* TITLE */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10" style={{ marginTop: "8%" }}>
              <div className="row ml-1">
                <div>
                  <h1>{title}</h1> 
                  {price !== 0 && idCreator !== loggedId && <h3>{`($${price})`}</h3>}
                </div>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* PAYPAL  */}

        {/* USER */}
        <div className="container mt-2">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-1">
              <img
                className="multimediaAvatar"
                src={API_URL_IMAGES + avatar}
                alt=""
              />
            </div>
            <div className="col-3 pl-0">
              <span>
                {name} {surname}
              </span>
              <br />

              <small className="text-muted">
                {new Date(time).toLocaleDateString()}
              </small>
            </div>

            <div className="col-4"></div>

            <div className="col-2 iconsDisplay">
              {idCreator === loggedId && (
                <img
                  onClick={() => this.deleteMultimedia(this.id_multimedia)}
                  className="iconsSize"
                  src={deleteIcon}
                  alt=""
                />
              )}
              {linkedin && (
                <a href={linkedin}>
                  <img className="iconsSize" src={linkedinIcon} alt="" />{" "}
                </a>
              )}
              {youtube && (
                <a href={youtube}>
                  <img className="iconsSize" src={youtubeIcon} alt="" />{" "}
                </a>
              )}
            </div>
          </div>

          <div className="col-1"></div>
        </div>
        {/* multimedia */}
        {path.includes("youtu") ? (
          <div className="container mt-5">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                {!isVideoTimeUp && (
                  <YouTube
                    opts={opts}
                    videoId={getYoutubeId(path)}
                    // onReady={this._onReady}
                    onPlay={this.playVideo}
                  />
                )}
                {isVideoTimeUp && (
                  <div className="animated fadeInDown slower text-center">
                    <h3 className="">Do you like what you are seeing?</h3>
                    <img src={logoKane} alt="" className="watermark" />
                    <div className="mt-2"
                    style={{width: "30%", marginLeft: "35%"}}>
                    <PayPalButton
                    style={{ layout: "horizontal", color: "black" }}
                    clientId={
                      "ATc97fL9cAzQaJ5ylAR6lMNSlNlMAW5cIj7-zMWORzBXamFmgwo6IIFufCGgHBskwFmmfvitrCkDsSOl"
                    }
                    amount={`${price}`}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={(details, data) => {
                      console.log(details);
                      console.log(data);
                      swal({
                        title: "Success!",
                        text: "Thanks for your purchase!",
                        icon: "success",
                        timer: 4000
                      });
                      const { orderID } = data;
                      // OPTIONAL: Call your server to save the transaction
                      this.savePurchaseInDDBB(orderID);
                    }}
                  />
                  </div>
                    {/* <button
                      className="btn btn-block mb-2 mt-3 buttonColor animated bounceInUp"
                      style={{ width: "30%", marginLeft: "35%" }}
                    >
                      Buy the full video!
                    </button> */}
                    <span className="text-center">
                      Take me back to the{" "}
                      <a
                        onClick={() => this.setState({ isVideoTimeUp: false })}
                        href="#"
                      >
                        preview
                      </a>
                    </span>
                  </div>
                )}
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <div
                  className="multimediaImage"
                  style={{
                    backgroundImage: `url(${API_URL_MULTIMEDIA + path})`
                  }}
                >
                  {/* WATERMARK */}
                  {price !== 0 && idCreator !== loggedId && !isPurchased && (
                    <img src={logoKane} alt="" className="watermark" />
                  )}
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        )}
        {/* DESCRIPTION  */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-7 mt-5">
              <div className="row">
                <h3 className="ml-3">Summary  </h3>

                {idCreator === loggedId && (
                  <Link to={`/uploadArticle/${this.id_multimedia}`}>
                    <small>
                      <img className="iconsSize" src={editIcon} alt="" />
                    </small>
                  </Link>
                )}
              </div>
              <hr />
              <p>{description}</p>
            </div>
            {/* PAYPAL BUTTON */}
            <div className="col-3 mt-2">
              {!path.includes("youtu") &&
                price !== 0 &&
                idCreator !== loggedId &&
                !isPurchased && (
                  <PayPalButton
                    style={{ layout: "horizontal", color: "black" }}
                    clientId={
                      "ATc97fL9cAzQaJ5ylAR6lMNSlNlMAW5cIj7-zMWORzBXamFmgwo6IIFufCGgHBskwFmmfvitrCkDsSOl"
                    }
                    amount={`${price}`}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={(details, data) => {
                      console.log(details);
                      console.log(data);
                      swal({
                        title: "Success!",
                        text: "Thanks for your purchase!",
                        icon: "success",
                        timer: 4000
                      });
                      const { orderID } = data;
                      // OPTIONAL: Call your server to save the transaction
                      this.savePurchaseInDDBB(orderID);
                    }}
                  />
                )}
              {isPurchased && (
                <span className="badge badge-success badgeMargin">
                  purchased
                </span>
              )}
              {price === 0 && (
                <span
                  className="badge badge-warning badgeMargin"
                >
                  free
                </span>
              )}
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* TEXT  */}
        {type === "article" && price == 0 && (
          <div className="container mt-5">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <h3>Content</h3>
                <hr />
                <p>{ReactHtmlParser(`${textArea}`)}</p>
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ files }) => ({
  files
});

const mapDispatchToProps = {
  setChosenFile: SetChosenFileAction,
  deleteFile: DeleteFileAction,
  unsetFiles: UnsetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleMultimedia);
