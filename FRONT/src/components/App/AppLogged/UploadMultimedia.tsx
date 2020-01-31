import React from "react";
import { IStore } from "../../../interfaces/IStore";
import { myFetch } from "../../../utils";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";

interface IState {
  title: string;
  price: string;
  category: string;
  textArea: string;
}
interface IProps {
  type: string;
}

interface IGlobalStateProps {
  account: IAccount | null;
}

type TProps = IGlobalStateProps & IProps;

class AploadMultimedia extends React.PureComponent<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    this.state = {
      title: "",
      price: "",
      category: "",
      textArea: ""
    };

    this.fileInputRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile() {
    const { account } = this.props;
    const initialState = { title: "", price: "", category: "", textArea: "" };
    if (this.fileInputRef.current?.files?.length && account) {
      const token: any = localStorage.getItem("token");
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", this.state.title);
      formData.append("type", this.props.type);
      formData.append("price", this.state.price);
      formData.append("category", this.state.category);
      formData.append("textArea", this.state.textArea);
      console.log(formData);
      myFetch({
        method: "POST",
        path: "/multimedia/create",
        token,
        formData
      }).then(json => {
        if (json) {
          console.log("ok");
          //addFile(json);
        }
      });
      this.setState(initialState);
      this.fileInputRef.current.value = "";
    }
  }
  render() {
    //TODO controlar el imput tipe price. Scroll en el select
    return (
      <>
        <div>
          <input type="file" ref={this.fileInputRef} id="file-name" />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Category:</label>
            <select
              className="form-control" data-spy="scroll"
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
          <label>Text:</label>
          <textarea
            className="form-control"
            value={this.state.textArea}
            onChange={e => this.setState({ textArea: e.target.value })}
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

export default connect(mapStateToProps)(AploadMultimedia);
