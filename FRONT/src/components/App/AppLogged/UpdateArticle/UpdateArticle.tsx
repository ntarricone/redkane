import React, { Component } from "react";
import { connect } from "react-redux";

import { IFiles } from "../../../../interfaces/IFiles";
import { myFetch } from "../../../../utils";

// import "./SingleMultimedia.css";
import ReactHtmlParser from "react-html-parser";
import { IStore } from "../../../../interfaces/IStore";
import { API_URL_MULTIMEDIA } from "../../../../constants";
import { SetChosenFileAction } from "../../../../redux/actions";
import { IFile } from "../../../../interfaces/IFile";



interface IGlobalStateProps {
  files: IFiles;
}

interface IGlobalActionProps {
  setChosenFile(file: IFile): void;
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
}

type TProps = IProps & IGlobalStateProps & IGlobalActionProps;

class UpdateArticle extends React.PureComponent<TProps, IState> {
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
      id: null
    };
    this.setFile = this.setFile.bind(this);

  }

  componentDidMount() {
    this.setFile();
  }

  setFile() {
    console.log(this.props.files.chosenFile)
    if(this.props.files.chosenFile.multimediaId !== 0){
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
  }else{
    setTimeout(
      (token = localStorage.getItem("token")) =>
        myFetch({ path: `/multimedia/single/${this.id_multimedia}`, token }).then(
          file => {
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
            }
          }
        ),
      200
    );
  }
}
  
  render() {
    const {
      title,
      textArea,
      description,
      path,
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
        {/* DESCRIPTION  */}
         <div className="container mt-5">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
            <h3>Article Summary</h3>
            <hr/>
              <p>{description}</p>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* TEXT  */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
            <h3>Content</h3>
            <hr/>
              <p>{ReactHtmlParser(`${textArea}`)}</p>
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

const mapDispatchToProps: IGlobalActionProps = {
  setChosenFile: SetChosenFileAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateArticle);
