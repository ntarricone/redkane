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
  path: string;
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
      textArea: "",
      path: ""
    };

    this.fileInputRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }

  //TODO - ADD ADDED FILE TO REDUX
  uploadFile() {
    const initialState = { title: "", price: "", category: "", textArea: "" };
    const { account, type } = this.props;
    const {title, price, category, textArea, path} = this.state;
    const token: any = localStorage.getItem("token");

    if (this.fileInputRef.current?.files?.length && account) {
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("textArea", textArea);
      console.log(formData);
      myFetch({
        method: "POST",
        path: "/multimedia/createImage",
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
    }else{
      myFetch({
        path: "/multimedia/createVideo",
        method: "POST",
        json: { title, type, price, category, path, textArea },
        token
      })
    }
  }
  render() {
    const {type} = this.props;
    //TODO controlar el imput tipe price. Scroll en el select
    //TODO - arreglar que se puedan poner links the youtube en vez de subir archivos
    return (
      <>
        <div>
          {type === "image"? 
          <input type="file" ref={this.fileInputRef} id="file-name" />:
          <input
          placeholder="Youtube Link"
          type="text"
          className="form-control"
          value={this.state.path}
          onChange={e => this.setState({ path: e.target.value })}
        />
          }
          
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
