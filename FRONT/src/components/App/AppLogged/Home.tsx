import React from "react";
import ContentUploader from "../../shared/ContentUploader/ContentUploader";
import Filter from "../../shared/Filter/Filter";
import { IAccount } from "../../../interfaces/IAccount";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { SetFilesAction, UnsetFilesAction } from "../../../redux/actions";
import { IFile } from "../../../interfaces/IFile";
import { myFetch } from "../../../utils";
import { IFiles } from "../../../interfaces/IFiles";
import MultimediaView from "./MultimediaViews/MultimediaView";
import InfiniteScroll from "react-infinite-scroll-component";
import "../../shared/Filter/Filter.css"

interface IGlobalStateProps {
  account: IAccount;
  files: IFiles;
}

interface IGlobalActionProps {
  setFiles(files: IFile[]): void;
  unsetFiles(): void;
}

interface IState {
  type: "" | "article" | "image" | "video" | "free";
  price: number | null;
  category: string;
  counter: number;
  hasMore: boolean;
}

type TProps = IGlobalStateProps & IGlobalActionProps;

class Home extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      type: "",
      price: 0,
      category: "default",
      counter: 9,
      hasMore: true
    };

    this.getFreeContent = this.getFreeContent.bind(this);
    this.settingCategory = this.settingCategory.bind(this);
    this.settingMoreFiles = this.settingMoreFiles.bind(this);
    this.cookies = this.cookies.bind(this);
    this.changeTypeToDefault = this.changeTypeToDefault.bind(this);
  }

  componentDidMount() {
    // this.props.unsetFiles();
    const token = localStorage.getItem("token");
    this.settingFiles("");
    this.cookies();
  }
  
  changeTypeToDefault(){
    this.setState({type: "", category: "default", hasMore: false});

  }

  

  settingFiles(type: any) {
    this.setState({ counter: 9, hasMore: true, type: type, category: "" });
    setTimeout(
      ({ token } = this.props.account, { setFiles } = this.props) =>
        myFetch({
          path: `/multimedia/${type}`,
          token
        }).then(files => {

          if (files) {
            setFiles(files);
          }
        }),
      200
    );
  }

  getFreeContent() {
    this.setState({ counter: 9, hasMore: false, price: 0, type: "free", category: "default" });
    const { price } = this.state;
    const token: any = localStorage.getItem("token");
    setTimeout(
      ({ token } = this.props.account, { setFiles } = this.props) =>
        myFetch({ path: `/multimedia/byPrice/${price}`, token }).then(files => {
          console.log("entri");
          console.log(files);
          if (files) {
            setFiles(files);
          }
        }),
      300
    );
  }


  settingCategory(){
    this.props.unsetFiles();
    const { category, type } = this.state;
    console.log(category)
    this.setState({ hasMore: false });
    const token: any = localStorage.getItem("token");
     const { setFiles } = this.props
     if (this.state.type !== "free"){
     myFetch({
      method: "POST",
      path: `/multimedia/byCategory/${category}`,
      token,
      json: { type }
    }).then(files => {
      if (files) {
        setFiles(files);
        this.setState(files); 
      } 
    });
  }else{
    myFetch({
      method: "GET",
      path: `/multimedia/byFreeAndCategory/${category}`,
      token
    }).then(files => {
      if (files) {
        setFiles(files);
        this.setState(files); 
      } 
    });
  }
    
  }

  //GET MORE FILES
  settingMoreFiles() {
    console.log("more fiiiilesss!!");
    console.log("ordeeer" + this.props.files.order)
    console.log("counter" + this.state.counter)
    //HERE WE CAN CHANGE TO THE AMOUNT OF FILES WE WANT!
    if (this.props.files.order.length >= 30) {
      this.setState({ hasMore: false });
      return;
    }
    let { counter } = this.state;
    this.setState({ counter: counter + 3 });
    console.log(counter);
    const token: any = localStorage.getItem("token");
    const { type, price } = this.state;
    myFetch({
      method: "POST",
      path: `/multimedia/getMore`,
      token,
      json: { counter, type, price }
    }).then(files => {
      console.log("entri");
      console.log(files);
      if (files) {
        this.props.setFiles(files);
      }
    });
  }

  //TODO - COOKIES FOR ARTICLLEEE

  cookies() {
    document.cookie = "juanitoooo";
    console.log(document.cookie);
  }

  render() {
    const { files } = this.props;
    const { category, type } = this.state;
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm d-flex justify-content-center marginTopUploader"></div>
          </div>
        </div>
        <div className="container ">
          <div className="row mt-4 mb-5">
            <div className="col-sm-4  col-12 mt-3">
              <div className="btn-group search-group">
              {type === "" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === ''?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("")}
                >
                  All
                </button>
                {type === "article" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'article'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("article")}
                >
                  Articles 
                </button>
                {type === "image" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'image'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("image")}
                >
                  Images 
                </button>
                {type === "video" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'video'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("video")}
                >
                  Videos 
                </button>
                {type === "free" && <i className="fas fa-search mt-2"></i>}
                <button
                  className={type === 'free'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.getFreeContent()}
                >
                  Free 
                </button>
              </div>
            </div>
            <div className="col-sm-2 col-6 mt-3">
            <select
              className="form-control"
              style={{ width: "9rem" }}
              data-spy="scroll"
              // defaultValue="selected"
              value={this.state.category}
              
               onChange={e => {this.setState({ category: e.target.value })

               setTimeout(
                 () =>{this.settingCategory()},40)
               }}
              
              
            >
              <option value = "default">Category...</option>
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
            <div className="col-sm-3 col-6 mt-3">
              <Filter parent={"home"} changeTypeToDefault={this.changeTypeToDefault}></Filter>
            </div>
            <div
              className="col-sm-3 col-12 mt-2"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              {this.props.account.isCreator ? (
                <ContentUploader></ContentUploader>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <InfiniteScroll
          dataLength={files.order.length}
          next={() => this.settingMoreFiles()}
          hasMore={this.state.hasMore}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          // onScroll={this.settingFiles}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="container">
            <div className="row">
              {files.order.map(id => (
                <div key={id} className="col-sm-6 col-md-4 col-12 ">
                  <MultimediaView file={files.byId[+id]}></MultimediaView>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

const mapStateToProps = ({ account, files }: IStore): IGlobalStateProps => ({
  account,
  files
});

const mapDispatchToProps: IGlobalActionProps = {
  setFiles: SetFilesAction,
  unsetFiles: UnsetFilesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
