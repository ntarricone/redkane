import React, { Component } from "react";
import CKEditor from "ckeditor4-react";
import { myFetch } from "../../../utils";
import swal from "sweetalert";

class UploadArticle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      title: "",
      price: "",
      category: "",
      path: ""
    };

    this.fileInputRef = React.createRef();
    this.onEditorChange = this.onEditorChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile() {
    const initialState = { title: "", price: "", category: "", data: "" };
    const textArea = this.state.data;
    const title = this.state.title;
    const price = this.state.price;
    const category = this.state.category;
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
      console.log(formData);

      myFetch({
        method: "POST",
        path: "/multimedia/createMultimedia",
        token,
        formData
      }).then(json => {
        if (json) {
          console.log(json);
          console.log("ok");
          swal({
            title: "Success!",
            text: "Your article was uploaded",
            icon: "success",
            timer: 2000
          });
          this.setState(initialState);
          this.setState({data: "JOSEEEEEEEEEE"})
          this.fileInputRef.current.value = "";
        }
      });
    } else {
      window.alert("Please insert an image");
    }
  }

  onEditorChange(evt) {
    this.setState({
      data: evt.editor.getData()
    });
    console.log(this.state.data);
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12 marginTopUploader">
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.title}
                  onChange={e => this.setState({ title: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row mt-5">
            <div className="col-6">
              <input
                required
                type="file"
                ref={this.fileInputRef}
                id="file-name"
              />
            </div>
            <div className="col-4">
              <select
                className="form-control"
                data-spy="scroll"
                value={this.state.category}
                onChange={e => this.setState({ category: e.target.value })}
              >
                <option selected>Category...</option>
                <option value="environmet">environmet</option>
                <option value="politics">politics</option>
                <option value="sports">sports</option>
                <option value="tech">tech</option>
                <option value="world_news">world news</option>
                <option value="business">business</option>
                <option value="culture">culture</option>
                <option value="fashion">fashion</option>
                <option value="travel">travel</option>
                <option value="other">other</option>
              </select>
            </div>
            <div className="col-2">
              <input
                placeholder="Price"
                className="form-control"
                type="number"
                value={this.state.price}
                onChange={e => this.setState({ price: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 mt-5">
              <CKEditor data="" onChange={this.onEditorChange} />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-4 mt-3">
              <button
                disabled={
                  !this.state.data | !this.state.category | !this.state.title
                }
                onClick={this.uploadFile}
              >
                Upload
              </button>
            </div>
          </div>
        </div>

      
      </>
    );
  }
}

export default UploadArticle;
