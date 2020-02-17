import React from "react";
import CKEditor from "ckeditor4-react";
import { myFetch, getYoutubeId } from "../../../utils";
import swal from "sweetalert";
import history from "../../../history";
import { connect } from "react-redux";
import { SetChosenFileAction } from "../../../redux/actions";
import { API_URL_MULTIMEDIA } from "../../../constants";
import {decode} from 'jsonwebtoken';
import "./UploadArticle.css"

import YouTube from "react-youtube";

class UploadArticle extends React.PureComponent {
  id_multimedia = history.location.pathname.split("/").slice(-1)[0];

  constructor(props) {
    super(props);
    this.state = {
      data: "",
      description: "",
      title: "",
      price: "",
      category: "",
      path: "",
      type: "",
      file: null
    };

    this.fileInputRef = React.createRef();
    this.onEditorChange = this.onEditorChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.setFile = this.setFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.id_multimedia !== "0") {
      this.setFile();
    } else {
    }
  }

  setFile() {
    if (this.props.files.chosenFile.multimediaId !== 0) {
      const {
        title,
        path,
        price,
        category,
        description,
        textArea,
        type
      } = this.props.files.chosenFile;
      this.setState({
        title,
        path,
        price,
        category,
        description,
        data: textArea,
        type
      });
    } else {
      setTimeout(
        (token = localStorage.getItem("token")) =>
          myFetch({
            path: `/multimedia/single/${this.id_multimedia}`,
            token
          }).then(file => {
            if (file) {
              const {
                title,
                path,
                price,
                category,
                description,
                textArea,
                type
              } = file;
              this.setState({
                title,
                path,
                price,
                category,
                description,
                data: textArea,
                type
              });
              this.props.setChosenFile(file);
            }
          }),
        500
      );
    }
  }

  uploadFile() {
    const initialState = {
      title: "",
      price: "",
      category: "",
      data: "",
      file: null
    };
    const textArea = this.state.data;
    const { title, price, category, description } = this.state;
    const token = localStorage.getItem("token");

    if (this.fileInputRef.current?.files?.length) {
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", title);
      formData.append("type", "article");
      formData.append("price", price);
      formData.append("category", category);
      formData.append("textArea", textArea);
      formData.append("description", description);
      myFetch({
        method: "POST",
        path: "/multimedia/createArticle",
        token,
        formData
      }).then(file => {
        if (file) {
          swal({
            title: "Success!",
            text: "Your article was uploaded",
            icon: "success",
            timer: 4000
          });
          this.setState(initialState);
          this.fileInputRef.current.value = "";
          this.props.setChosenFile(file);
          history.push(`/singleMultimedia/${file.multimediaId}`);
        }
      });
    } else {
      window.alert("Please insert an image");
    }
  }

  updateFile() {
    const initialState = {
      title: "",
      price: "",
      category: "",
      data: ""
    };
    const textArea = this.state.data;
    const { title, price, category, description, path } = this.state;
    const token = localStorage.getItem("token");

    if (this.fileInputRef.current?.files?.length) {
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", title);
      formData.append("type", "article");
      formData.append("price", price);
      formData.append("category", category);
      formData.append("textArea", textArea);
      formData.append("description", description);

      myFetch({
        method: "POST",
        path: `/multimedia/update/${this.id_multimedia}`,
        token,
        formData
      }).then(file => {
        if (file) {
          swal({
            title: "Success!",
            text: "Your article was uploaded",
            icon: "success",
            timer: 4000
          });
          this.setState(initialState);
          this.fileInputRef.current.value = "";
          this.props.setChosenFile(file);
          history.push(`/singleMultimedia/${file.multimediaId}`);
        }
      });
    } else {
      myFetch({
        path: `/multimedia/update/${this.id_multimedia}`,
        method: "POST",
        json: { title, price, category, description, textArea, path },
        token
      }).then(file => {
        if (file) {
          swal({
            title: "Success!",
            text: "Your article was updated",
            icon: "success",
            timer: 4000
          });
          this.setState(initialState);
          this.props.setChosenFile(file);
          history.push(`/singleMultimedia/${file.multimediaId}`);
        }
      });
    }
  }

  onEditorChange(evt) {
    this.setState({
      data: evt.editor.getData()
    });
  }

  //Preview Image
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  render() {
    const {
      title,
      description,
      category,
      price,
      path,
      type,
      file
    } = this.state;
    const token = localStorage.getItem("token")
    const { isAdmin } = decode(token)
    
    //youtube video configuration
    const opts = {
      height: "400",
      width: "880"
    };
    return (
      <>
        {/* Title */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 marginTopUploader">
              <div>
                <input
                  placeholder="Title"
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={e => this.setState({ title: e.target.value })}
                />
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* Preview of Image or video only for update */}
        {this.id_multimedia !== "0" && (
          <div className="container">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10 mt-2 pl-3 ">
                <div className="updateImageSizeResponsive">
                  {type !== "video" && (
                    <div
                      className="multimediaImage mt-3"
                      style={{
                        backgroundImage: `url(${API_URL_MULTIMEDIA + path})`
                      }}
                    ></div>
                  )}
                  {type === "video" && (
                    <YouTube opts={opts} videoId={getYoutubeId(path)} />
                  )}
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        )}
        {/* File / Category / Price */}
        <div className="container">
          <div className="row mt-3">
            <div className="col-1"></div>
            <div className="col-5">
              {type !== "video" ? (
                <input
                  type="file"
                  ref={this.fileInputRef}
                  id="file-name"
                  onChange={this.handleChange}
                />
              ) : (
                <input
                  placeholder="Youtube Link"
                  type="text"
                  className="form-control"
                  value={this.state.path}
                  onChange={e => this.setState({ path: e.target.value })}
                />
              )}
              <div className="  mt-4 pl-1.8">
              
                {/* Show Preview Image */}
                {file == null ? (
                  ""
                ) : (
                 
                  <img className="multimediaImage" src={this.state.file} style={{width: "400px", height: "30vh"}} />
                  
                )}
              
              </div>

              {/* Category */}
            </div>
            <div className="col-sm-3 col-8 mt-2 ">
            {isAdmin === true ?  <select
                className="form-control  categoryPriceResponsive"
                data-spy="scroll"
                value={category}
                onChange={e => this.setState({ category: e.target.value })}
              >
                <option defaultValue>Category...</option>
                <option value="environment">environment</option>
                <option value="politics">politics</option>
                <option value="sports">sports</option>
                <option value="tech">tech</option>
                <option value="world_news">world news</option>
                <option value="business">business</option>
                <option value="culture">culture</option>
                <option value="fashion">fashion</option>
                <option value="travel">travel</option>
                <option value="other">other</option>
                <option value="redkaneLive">redkaneLive</option>
              </select> :
              <select
              className="form-control categoryPriceResponsive"
              data-spy="scroll"
              value={category}
              onChange={e => this.setState({ category: e.target.value })}
            >
              <option defaultValue>Category...</option>
              <option value="environment">environment</option>
              <option value="politics">politics</option>
              <option value="sports">sports</option>
              <option value="tech">tech</option>
              <option value="world_news">world news</option>
              <option value="business">business</option>
              <option value="culture">culture</option>
              <option value="fashion">fashion</option>
              <option value="travel">travel</option>
              <option value="other">other</option>
            </select>}
            </div>
            {/* Price */}
            <div className="col-sm-2 col-5 mt-2">
              <input
                placeholder="Price  "
                className="form-control categoryPriceResponsive"
                type="number"
                value={price}
                onChange={e => this.setState({ price: e.target.value })}
              />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* Description */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10 mt-5">
              <textarea
                placeholder="Tell us in a paragraph what would your multimedia is about"
                className="form-control"
                value={description}
                onChange={e => this.setState({ description: e.target.value })}
              />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        {/* Text Editor */}
        {(type === "article") | (this.id_multimedia === "0") ? (
          <div className="container">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10 mt-3">
                <CKEditor
                  data={this.state.data}
                  onChange={this.onEditorChange}
                />
              </div>
              <div className="col-1"></div>
            </div>
          </div>
        ): ""}
        {/* Upload / Update button */}
        <div className="container">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-4 mt-3">
              {this.id_multimedia === "0" ? (
                <button
                  disabled={
                    !this.state.data | !this.state.category | !this.state.title
                  }
                  onClick={this.uploadFile}
                >
                  Upload
                </button>
              ) : (
                <button
                  disabled={
                    (!this.state.data && type === "article") |
                    !this.state.category |
                    !this.state.title
                  }
                  onClick={this.updateFile}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ files, account }) => ({
  files,
  account
});

const mapDispatchToProps = {
  setChosenFile: SetChosenFileAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadArticle);
