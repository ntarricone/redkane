import React from "react";
import { IStore } from "../../../interfaces/IStore";
import { myFetch } from "../../../utils";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";
import { AddFileAction } from "../../../redux/actions";
import { IFile } from "../../../interfaces/IFile";
import swal from "sweetalert";
import {decode} from 'jsonwebtoken';
import './UploadMultimedia.css';
import preview from '../../../images/preview.png'
import photo from '../../../icons/photo.png';


interface IState {
  title: string;
  price: string;
  category: string;
  description: string;
  path: string;
  file:any;
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
      path: "",
      file: null
    };

    this.fileInputRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  uploadFile() {
    const initialState = {
      title: "",
      price: "",
      category: "",
      description: "",
      file: null
    };
    const { account, type } = this.props;
    const { title, price, description } = this.state;
    let { path, category } = this.state;
    const token: any = localStorage.getItem("token");
    category = category? category : "other";
    if (this.fileInputRef.current?.files?.length && account) {
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      myFetch({
        method: "POST",
        path: "/multimedia/createImage",
        token,
        formData
      }).then(json => {
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
    } else if(path !== ""){

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
    else{
      window.alert("Please add your multimedia")
    }
  }
//Preview Image
  handleChange(event: any) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }


  render() {
    const { type } = this.props;
    const token : any = localStorage.getItem("token")
    const { isAdmin }: any = decode(token)
    const { file } = this.state;
    //TODO controlar el imput tipe price. Scroll en el select
    return (
      <>
        {/* Uploading image or adding youtube link */}
        <div>
          {type === "image" ? (
            <div>
            <input
              required
              type="file"
              ref={this.fileInputRef}
              id="file-name"
              onChange={this.handleChange}
            />
           {/* Show Preview Image */}
            {file ==null ? 
              ("")
            :
            <img className="preview" src={this.state.file}/>
            }
            </div>
            
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
            {isAdmin ? <select
            required
              className="form-control"
              data-spy="scroll"
              value={this.state.category}
              onChange={e => this.setState({ category: e.target.value })}
            >
              <option value = "default">Choose...</option>
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
              required
              className="form-control"
              data-spy="scroll"
              value={this.state.category}
              onChange={e => this.setState({ category: e.target.value })}
            >
              <option value = "default">Choose...</option>
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
            </select> }
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
