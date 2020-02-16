import React from "react";
import { connect } from "react-redux";
import { myFetch, getYoutubeId } from "../../../../../utils";
import {
  API_URL_MULTIMEDIA,
  API_URL_IMAGES,
  PAYPAL_CLIENT_ID
} from "../../../../../constants";
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
import deleteIconWhite from "../../../../../icons/whiteTrash.png";
import editIcon from "../../../../../icons/edit.png";
import editIconWhite from "../../../../../icons/whiteEdit.png";
import swal from "sweetalert";
import history from "../../../../../history";
import logoKane from "../../../../../images/logoKane.png";
import like from "../../../../../icons/like.png";
import redLiked from "../../../../../icons/likedRed.png";
import redLike from "../../../../../icons/likeRed.png";
import liked from "../../../../../icons/liked.png";
import YouTube from "react-youtube";
import { PayPalButton } from "react-paypal-button-v2";
import ClapButton from "react-clap-button";

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
      isPurchased: false,
      isLiked: false,
      likes: null
    };
    this.setFile = this.setFile.bind(this);
    this.setUser = this.setUser.bind(this);
    this.deleteMultimedia = this.deleteMultimedia.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.setPurchaseStatus = this.setPurchaseStatus.bind(this);
    this.savePurchaseInDDBB = this.savePurchaseInDDBB.bind(this);
    this.likeDislike = this.likeDislike.bind(this);
    this.setLikedStatus = this.setLikedStatus.bind(this);
  }

  componentDidMount() {
    this.setFile();
    const token = localStorage.getItem("token");
    this.setPurchaseStatus(token);
    this.setLikedStatus();
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
      }, 15000);
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

  likeDislike() {
    console.log("entramus");
    const token = localStorage.getItem("token");
    myFetch({
      method: "POST",
      path: `/users/likeDislike/${this.id_multimedia}`,
      token
    }).then(response => {
      console.log(response);
      let count = response ? 1 : -1;
      this.setState({ isLiked: response, likes: this.state.likes + count });
      console.log(this.state.isLiked);
    });
  }

  setLikedStatus() {
    console.log("entramus");
    const token = localStorage.getItem("token");
    myFetch({
      path: `/users/likes/${this.id_multimedia}`,
      token
    }).then(response => {
      console.log(response);
      this.setState({ isLiked: response.isLiked, likes: response.likes });
      console.log(this.state);
    });
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
      category,
      isLiked,
      likes
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
        <div
          className="container-fluid"
          style={{
            color: category == "redkaneLive" ? "white" : "",
            backgroundColor: category == "redkaneLive" ? "black" : ""
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10" style={{ marginTop: "8%" }}>
                <div className="row ml-1">
                  <div className="subtitleResponsive">
                    <h5>
                      <i
                        style={{
                          color: category == "redkaneLive" ? "#d42727" : ""
                        }}
                      >
                        {category.toUpperCase()}
                      </i>
                    </h5>
                    <h1>
                      <strong>{title}</strong>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </div>

          {/* USER */}
          <div className="container mt-2">
            <div className="row">
              <div className="col-1">
                {/* LIKE BUTTON  */}

                <label htmlFor="">
                  {/* add btn to hide */}
                  <button
                    className="btn"
                    style={{ position: "fixed", zIndex: "10" }}
                  >
                    {isLiked && category != "redkaneLive" && (
                      <img
                        src={liked}
                        alt=""
                        style={{ position: "fixed" }}
                        className="iconsSize likeResponsive"
                        onClick={this.likeDislike}
                      />
                    )}
                    {isLiked && category == "redkaneLive" && (
                      <img
                        src={redLiked}
                        alt=""
                        style={{ position: "fixed" }}
                        className="iconsSize likeResponsive"
                        onClick={this.likeDislike}
                      />
                    )}
                    {!isLiked && category != "redkaneLive" && (
                      <img
                        src={like}
                        alt=""
                        style={{ position: "fixed" }}
                        className="iconsSize likeResponsive"
                        onClick={this.likeDislike}
                      />
                    )}
                    {!isLiked && category == "redkaneLive" && (
                      <img
                        src={redLike}
                        alt=""
                        style={{ position: "fixed" }}
                        className="iconsSize likeResponsive"
                        onClick={this.likeDislike}
                      />
                    )}

                    <small>
                      <span
                        style={{ position: "fixed" }}
                        className={
                          category !== "redkaneLive"
                            ? "likesCount mt-3 ml-5"
                            : " likesCount mt-3 ml-5 text-white"
                        }
                      >
                        {likes}
                      </span>
                    </small>
                  </button>
                </label>
              </div>
              <div className="col-1">
                <label htmlFor="">
                  <Link to={`/updateProfile/${idCreator}`}>
                    <img
                      className="multimediaAvatar"
                      src={API_URL_IMAGES + avatar}
                      alt=""
                    />
                  </Link>
                </label>
              </div>
              <div className="col-3 pl-0">
                <span id="idUserCreator">
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
                {idCreator === loggedId && category == "redkaneLive" && (
                  <img
                    onClick={() => this.deleteMultimedia(this.id_multimedia)}
                    className="iconsSize"
                    src={deleteIconWhite}
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
            <div className="container mt-2">
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
                  <div>
                    <div
                      className="container "
                      style={{ display: "flex", placeContent: "flex-end" }}
                    >
                      <div className="row">
                        {price !== 0 &&
                          idCreator !== loggedId &&
                          type !== "article" && (
                            <h4 className="pr-3">{`($${price})`}</h4>
                          )}
                      </div>
                    </div>
                  </div>

                  {isVideoTimeUp && (
                    <div className="animated fadeInDown slower text-center">
                      <h3 className="">Do you like what you are seeing?</h3>
                      <img src={logoKane} alt="" className="watermark" />
                      <div
                        className="mt-2"
                        style={{ width: "30%", marginLeft: "35%" }}
                      >
                        <PayPalButton
                          style={{ layout: "horizontal", color: "black" }}
                          clientId={PAYPAL_CLIENT_ID}
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
                      <span className="text-center">
                        Take me back to the{" "}
                        <a
                          onClick={() =>
                            this.setState({ isVideoTimeUp: false })
                          }
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
                      backgroundImage: `url(${API_URL_MULTIMEDIA + path})`,
                      backgroundRepeat: "no-repeat"
                    }}
                  >
                    {/* WATERMARK */}
                    {price !== 0 &&
                      type === "image" &&
                      idCreator !== loggedId &&
                      !isPurchased && (
                        <img src={logoKane} alt="" className="watermark" />
                      )}
                  </div>
                </div>
                <div className="col-1"></div>
              </div>
            </div>
          )}

          {/* PAYPAL BUTTON */}
          <div className="container">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-sm-6 col-3"></div>
              <div className="col-sm-1 col-4">
                {!path.includes("youtu") &&
                  type === "image" &&
                  price !== 0 &&
                  idCreator !== loggedId &&
                  !isPurchased && (
                    <h4
                      style={{ fontSize: "1.2rem !important" }}
                      className="pl-3 mt-2"
                    >{`($${price})`}</h4>
                  )}
              </div>

              <div className="col-sm-3 col-12 mt-2">
                {!path.includes("youtu") &&
                  type === "image" &&
                  price !== 0 &&
                  idCreator !== loggedId &&
                  !isPurchased && (
                    <PayPalButton
                      style={{ layout: "horizontal", color: "black" }}
                      clientId={PAYPAL_CLIENT_ID}
                      amount={`${price}`}
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
                        // Call server to save the transaction
                        this.savePurchaseInDDBB(orderID);
                      }}
                    />
                  )}
                {isPurchased && !path.includes("youtu") && (
                  <a
                    href={`http://localhost:3000/multimedia/${path}`}
                    className="badge badge-success badgeMargin"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Download"
                  >
                    purchased
                  </a>
                )}
                {isPurchased && path.includes("youtu") && (
                  <span className="badge badge-success badgeMargin">
                    purchased
                  </span>
                )}
                {idCreator === loggedId && (
                  <span className="badge badge-success badgeMargin">owner</span>
                )}
                {price === 0 && !path.includes("youtu") && (
                  <a
                    href={`http://localhost:3000/multimedia/${path}`}
                    className="badge badge-warning badgeMargin"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Download"
                  >
                    free
                  </a>
                )}
                {price === 0 && path.includes("youtu") && (
                  <span className="badge badge-warning badgeMargin">
                    free
                  </span>
                )}
              </div>
              <div className="col-1"></div>
            </div>
          </div>
          {/* DESCRIPTION  */}

          <div className="container">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <div className="row">
                  <h3 className="ml-3">Summary </h3>

                  {idCreator === loggedId && (
                    <Link to={`/uploadArticle/${this.id_multimedia}`}>
                      <small>
                        <img className="iconsSize" src={editIcon} alt="" />
                      </small>
                    </Link>
                  )}
                  {idCreator === loggedId && category == "redkaneLive" && (
                    <Link to={`/uploadArticle/${this.id_multimedia}`}>
                      <small>
                        <img className="iconsSize" src={editIconWhite} alt="" />
                      </small>
                    </Link>
                  )}
                </div>
                <hr />
                <p>{description}</p>
              </div>

              <div className="col-1"></div>
            </div>
          </div>

          {/* TEXT  */}

          <div className="container ">
            <div className="row">
              <div className="col-1"></div>

              {type === "article" && (
                <div className="col-10">
                  <h3>Content</h3>
                  <hr />
                  {(price === 0) | isPurchased | (idCreator === loggedId) ? (
                    <p className="animated bounceInUp slower">
                      {ReactHtmlParser(`${textArea}`)}
                    </p>
                  ) : (
                    <div>
                      <div className="paypalButtonArticle">
                        <h1 style={{ marginLeft: "38%" }}>{`-$${price}-`}</h1>
                        <PayPalButton
                          style={{ layout: "horizontal", color: "black" }}
                          clientId={PAYPAL_CLIENT_ID}
                          amount={`${price}`}
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
                            // Call server to save the transaction
                            this.savePurchaseInDDBB(orderID);
                          }}
                        />
                      </div>
                      <p className="blurredtext ">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum." Section 1.10.32 of "de Finibus
                        Bonorum et Malorum", written by Cicero in 45 BC "Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium doloremque laudantium, totam rem aperiam,
                        eaque ipsa quae ab illo inventore veritatis et quasi
                        architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit
                        aut fugit, sed quia consequuntur magni dolores eos qui
                        ratione voluptatem sequi nesciunt. Neque porro quisquam
                        est, qui dolorem ipsum quia dolor sit amet, consectetur,
                        adipisci velit, sed quia non numquam eius modi tempora
                        incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem. Ut enim ad minima veniam, quis nostrum
                        exercitationem ullam corporis suscipit laboriosam, nisi
                        ut aliquid ex ea commodi consequatur? Quis autem vel eum
                        iure reprehenderit qui in ea voluptate velit esse quam
                        nihil molestiae consequatur, vel illum qui dolorem eum
                        fugiat quo voluptas nulla pariatur?" 1914 translation by
                        H. Rackham "But I must explain to you how all this
                        mistaken idea of denouncing pleasure and praising pain
                        was born and I will give you a complete account of the
                        system, and expound the actual teachings of the great
                        explorer of the truth, the master-builder of human
                        happiness. No one rejects, dislikes, or avoids pleasure
                        itself, because it is pleasure, but because those who do
                        not know how to pursue pleasure rationally encounter
                        consequences that are extremely painful. Nor again is
                        there anyone who loves or pursues or desires to obtain
                        pain of itself, because it is pain, but because
                        occasionally circumstances occur in which toil and pain
                        can procure him some great pleasure. To take a trivial
                        example, which of us ever undertakes laborious physical
                        exercise, except to obtain some advantage from it? But
                        who has any right to find fault with a man who chooses
                        to enjoy a pleasure that has no annoying consequences,
                        or one who avoids a pain that produces no resultant
                        pleasure?"
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="col-1"></div>
            </div>
          </div>
        </div>
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
