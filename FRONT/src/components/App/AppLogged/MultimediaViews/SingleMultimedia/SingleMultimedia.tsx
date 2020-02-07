import React, { Component } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IFiles } from "../../../../../interfaces/IFiles";
import { myFetch } from "../../../../../utils";
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
import linkedinIcon from "../../../../../icons/linkedin.png";
import youtubeIcon from "../../../../../icons/youtube.png";
import deleteIcon from "../../../../../icons/trash.png";
import editIcon from "../../../../../icons/edit.png";
import swal from "sweetalert";
import history from "../../../../../history";

interface IGlobalStateProps {
  files: IFiles;
}

interface IGlobalActionProps {
  setChosenFile(file: IFile): void;
  deleteFile(id: number): void;
  unsetFiles(): void;
}

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
  description: string;
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
  id_multimedia = this.props.match.params.id;
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
      description: "",
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
    this.deleteMultimedia = this.deleteMultimedia.bind(this);
  }

  componentDidMount() {
    this.setFile();
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

  deleteMultimedia(id_multimedia: number) {
    swal({
      title: "Are you sure?",
      text: "By clicking ok you will delete this file permanently",
      icon: "warning",
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        const token: any = localStorage.getItem("token");
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

  setUser(id: number) {
    myFetch({ path: `/users/${id}` }).then(user => {
      if (user) {
        console.log(user);
        const { name, surname, email, avatar, youtube, linkedin } = user;
        this.setState({ name, surname, email, avatar, youtube, linkedin });
      }
    });
  }

  // setFile(multimediaId: number) {

  // }

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
      type
    } = this.state;
    let {avatar, path, title} = this.state;
    title = title? title: "Title missing :("
    avatar = avatar? avatar: "avatar.png";
    path = path? path: "defaultBanner.jpg";
    const token: any = localStorage.getItem("token");
    const { id: idLogged }: any = decode(token);
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
                </div>
              </div>
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
            </div>
            <div className="col-4"></div>
            <div className="col-2 iconsDisplay">
              {idCreator === idLogged && (
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

        {/* IMAGE OR VIDEO */}
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
                <div
                  className="multimediaImage"
                  style={{
                    backgroundImage: `url(${API_URL_MULTIMEDIA + path})`
                  }}
                ></div>
                {/* <img
                  style={{ width: "100%", height: "50vh" }}
                  src={API_URL_MULTIMEDIA + path}
                  alt=""
                /> */}
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        )}
        {/* DESCRIPTION  */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <div className="row">
                <h3 className="ml-3">Summary</h3>

                {idCreator === idLogged && (
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
            <div className="col-1"></div>
          </div>
        </div>
        {/* TEXT  */}
        {type === "article" && (
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

const mapStateToProps = ({ files }: IStore): IGlobalStateProps => ({
  files
});

const mapDispatchToProps: IGlobalActionProps = {
  setChosenFile: SetChosenFileAction,
  deleteFile: DeleteFileAction,
  unsetFiles: UnsetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleMultimedia);
