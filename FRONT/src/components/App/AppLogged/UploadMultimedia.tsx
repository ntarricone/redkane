import React from "react";
​
interface IState {
  title: string;
  type: string;
  price: string;
  category: string;
}
​
interface IGlobalStateProps {}
​
type TProps = IGlobalStateProps;
​
class UploadMultimedia extends React.PureComponent<TProps, IState> {
  inputFileRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      title: "",
      type: "",
      price: "",
      category: ""
    };
​
    this.inputFileRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }
  uploadFile() {
    if (this.inputFileRef.current?.files) {
      const path = this.inputFileRef.current.files[0];
      const formData = new FormData();
      formData.append("path", path);
      formData.append("title", this.state.title)
      formData.append("type", this.state.type)
      formData.append("price", this.state.price)
      formData.append("category", this.state.category)
      
​
      fetch("http://localhost:3000/multimedia/create", {
        method: "POST",
        body: formData
      });
    }
  }
  render() {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div>
                    <label>
                      File
                      <input type="file" ref={this.inputFileRef} />
                    </label>
                  </div>
                  <div>
                    <label>
                      title
                      <input
                        type="text"
                        value={this.state.title}
                        onChange={e => this.setState({ title: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                    type
                      <input
                        type="text"
                        value={this.state.type}
                        onChange={e => this.setState({ type: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                    price
                      <input
                        type="text"
                        value={this.state.price}
                        onChange={e => this.setState({ price: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                    category
                      <input
                        type="text"
                        value={this.state.title}
                        onChange={e => this.setState({ category: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <button onClick={this.uploadFile}>Upload multimedia</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6"></div>
            <div className="col-6">Hola</div>
          </div>
        </div>
      </>
    );
  }
}
​
export default UploadMultimedia;