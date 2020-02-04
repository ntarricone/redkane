import React, { Component } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IFiles } from "../../../../../interfaces/IFiles";
import { myFetch } from "../../../../../utils";
import { API_URL_MULTIMEDIA, API_URL_IMAGES } from "../../../../../constants";
import "./SingleMultimedia.css";
import linkedinIcon from "../../../../../icons/linkedin.png";
import youtubeIcon from "../../../../../icons/youtube.png";

interface IGlobalStateProps {
  files: IFiles;
}

interface IGlobalActionProps {}

interface IProps {
  match: any;
}

interface IState {
  title: string;
  time: string;
  path: string;
  type: string;
  price: number | null;
  category: string;
  language: string;
  views: number | null;
  reading_time: string;
  textArea: string;
  id: number | null;
  name: string;
  surname: string;
  avatar: string;
  email: string;
  youtube: string;
  linkedin: string;
}

type TProps = IProps & IGlobalStateProps & IGlobalActionProps;

class SingleMultimedia extends React.PureComponent<TProps, IState> {
  multimediaId = this.props.match.params.id;

  constructor(props: TProps) {
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
      textArea: "",
      id: null,
      name: "",
      surname: "",
      avatar: "",
      email: "",
      youtube: "",
      linkedin: ""
    };
    this.setFile = this.setFile.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    this.setFile(this.multimediaId);
  }

  setFile(multimediaId: number) {
    setTimeout(
      (token = localStorage.getItem("token")) =>
        myFetch({ path: `/multimedia/single/${multimediaId}`, token }).then(
          file => {
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
                textArea,
                id
              });
              this.setUser(id);
            }
          }
        ),
      200
    );
  }

  setUser(id: number) {
    myFetch({ path: `/users/${id}` }).then(user => {
      if (user) {
        console.log(user);
        const { name, surname, email, avatar, youtube, linkedin } = user;
        this.setState({ name, surname, email, avatar, youtube, linkedin });
      }
    });
  }

  render() {
    const {
      title,
      textArea,
      path,
      name,
      surname,
      email,
      avatar,
      youtube,
      linkedin,
      time
    } = this.state;
    return (
      <>
        {/* TITLE */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10" style={{ marginTop: "8%" }}>
              <h1>{title}</h1>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
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
              <small className="text-muted">{" " + email}</small>
            </div>
            <div className="col-4"></div>
            <div className="col-2 iconsDisplay">
              <a href={linkedin}>
                <img className="iconsSize" src={linkedinIcon} alt="" />{" "}
              </a>
              <a href={youtube}>
                <img className="iconsSize" src={youtubeIcon} alt="" />{" "}
              </a>
            </div>
          </div>
          <div className="col-1"></div>
        </div>

        {/* IMAGE */}
        {path.includes("youtube") ? (
          <div className="container mt-5">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
              <iframe
                style={{ width: "100%", height: "60vh" }}
                src={path + "?start=0&end=5"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              </div>

            </div>
            <div className="col-1"></div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <img
                  style={{ width: "100%", height: "50vh" }}
                  src={API_URL_MULTIMEDIA + path}
                  alt=""
                />
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        )}
        {/* TEXT  */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <p>{textArea}</p>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ files }: IStore): IGlobalStateProps => ({
  files
});

export default connect(mapStateToProps)(SingleMultimedia);
