import React from "react";
import { IStore } from "../../../interfaces/IStore";
import { myFetch, getYoutubeId } from "../../../utils";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";
import { AddFileAction } from "../../../redux/actions";
import { IFile } from "../../../interfaces/IFile";
import swal from "sweetalert";

interface IState {
  title: string;
  price: string;
  category: string;
  description: string;
  path: string;
}
interface IProps {
  type: string;
}

interface IGlobalStateProps {
  account: IAccount | null;
}

interface IGlobalActionProps {
  addFile(file: IFile): void;
}

type TProps = IGlobalStateProps & IGlobalActionProps & IProps;

class AploadMultimedia extends React.PureComponent<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    this.state = {
      title: "",
      price: "",
      category: "",
      description: "",
      path: ""
    };

    this.fileInputRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }


  uploadFile() {
    const initialState = {
      title: "",
      price: "",
      category: "",
      description: ""
    };
    const { account, type } = this.props;
    const { title, price, description } = this.state;
    let { path, category } = this.state;
    const token: any = localStorage.getItem("token");

    if (this.fileInputRef.current?.files?.length && account) {
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      console.log(formData);
      myFetch({
        method: "POST",
        path: "/multimedia/createImage",
        token,
        formData
      }).then(json => {
        console.log(json);
        if (json) {
          swal({
            title: "Success!",
            text: "You´ve successfully uploaded your image!",
            icon: "success",
            timer: 2000
          });
          this.props.addFile(json);
        }
      });

      this.setState(initialState);
      this.fileInputRef.current.value = "";
    } else {
      category = category? category : "other";
      myFetch({
        path: "/multimedia/createVideo",
        method: "POST",
        json: { title, type, price, category, path, description },
        token
      }).then(json => {
        if (json) {
          swal({
            title: "Success!",
            text: "You´ve successfully uploaded your video!",
            icon: "success",
            timer: 2000
          });
          this.props.addFile(json);
        }
      });
    }
  }


  render() {
    const { type } = this.props;
    //TODO controlar el imput tipe price. Scroll en el select
    return (
      <>
        {/* Uploading image or adding youtube link */}
        <div>
          {type === "image" ? (
            <input
              required
              type="file"
              ref={this.fileInputRef}
              id="file-name"
            />
          ) : (
            <input
              required
              placeholder="Youtube Link"
              type="text"
              className="form-control"
              value={this.state.path}
              onChange={e => this.setState({ path: e.target.value })}
            />
          )}
        </div>
        {/* Title */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
          />
        </div>
        {/* Category */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Category:</label>
            <select
              required
              className="form-control"
              data-spy="scroll"
              value={this.state.category}
              onChange={e => this.setState({ category: e.target.value })}
            >
              <option selected>Choose...</option>
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

          {/* Price */}
          <div className="form-group col-md-6">
            <label>Price €:</label>
            <input
              className="form-control"
              type="number"
              value={this.state.price}
              onChange={e => this.setState({ price: e.target.value })}
            />
          </div>
        </div>
        <div></div>
        <div>
          {/* Description */}
          <label>Brief description of your multimedia:</label>
          <textarea
            className="form-control"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.uploadFile}
            data-dismiss="modal"
          >
            Upload multimedia
          </button>
        </div>
      </>
    );
  }
}
const mapStateToProps = ({ account }: IStore): IGlobalStateProps => ({
  account
});

const mapDispatchToProps: IGlobalActionProps = {
  addFile: AddFileAction
};

export default connect(mapStateToProps, mapDispatchToProps)(AploadMultimedia);
