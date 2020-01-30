import React from "react";
import { IStore } from "../../../interfaces/IStore";
import { myFetch, generateAccountFromToken } from "../../../utils";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";

interface IState {
  title: string;
  type: string;
  price: string;
  category: string;
  textArea: string;
}

interface IGlobalStateProps {
  account: IAccount | null;
}



type TProps = IGlobalStateProps;

class AploadMultimedia extends React.PureComponent<TProps, IState> {
  fileInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      title: "",
      type: "",
      price: "",
      category: "",
      textArea: ""
    };

    this.fileInputRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }
  

  uploadFile() {
    const { account } = this.props;
    const initialState = {title: "", type: "", price: "", category: "", textArea: "" }
    if (this.fileInputRef.current?.files?.length && account) {
      const { token } = account;
      const path = this.fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", path);
      formData.append("title", this.state.title);
      formData.append("type", this.state.type);
      formData.append("price", this.state.price);
      formData.append("category", this.state.category);
      formData.append("textArea", this.state.textArea);
      console.log(formData)
      myFetch({ method: "POST", path: "/multimedia/create", token, formData }).then(
        json => {
          if (json) {
            console.log ('ok')
            //addFile(json);
          }
        }
      );
      this.setState(initialState)
      this.fileInputRef.current.value = "";
    }
  }
  render() {
    return (
      <>
        <div >
          <label >File:</label>
          <input  type="file" ref={this.fileInputRef} id="recipient-name" />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text" className="form-control"
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            id="recipient-name"
          />
        </div>
        <div>
          <label >Type:</label>
          <input className="form-control"
            type="text"
            value={this.state.type}
            onChange={e => this.setState({ type: e.target.value })}
            id="recipient-name"
          />
        </div>
        <div>
          <label >Category:</label>
          <input className="form-control"
            type="text"
            value={this.state.category}
            onChange={e => this.setState({ category: e.target.value })}
            id="recipient-name"
          />
        </div>
        <div>
          <label >Price:</label>
          <input className="form-control"
            type="number"
            value={this.state.price}
            onChange={e => this.setState({ price: e.target.value })}
            id="recipient-name"
          />
        </div>
        <div>
          <label >Text:</label>
          <textarea className="form-control"
            
            value={this.state.textArea}
            onChange={e => this.setState({ textArea: e.target.value })}
            id="recipient-name"
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
