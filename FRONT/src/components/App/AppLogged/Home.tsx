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
      category: "",
      counter: 9,
      hasMore: true
    };

    this.getFreeContent = this.getFreeContent.bind(this);
    this.settingCategory = this.settingCategory.bind(this);
    this.settingMoreFiles = this.settingMoreFiles.bind(this);
    this.cookies = this.cookies.bind(this);
  }

  componentDidMount() {
    // this.props.unsetFiles();
    const token = localStorage.getItem("token");
    this.settingFiles(this.state.type);
    this.cookies();
  }

  settingFiles(type: any) {
    console.log("Ooooooooooooooooooooooo");
    this.setState({ counter: 9, hasMore: true, type: type });
    setTimeout(
      ({ token } = this.props.account, { setFiles } = this.props) =>
        myFetch({
          path: `/multimedia/${type}`,
          token
        }).then(files => {
          console.log("entri");
          console.log(files);
          if (files) {
            setFiles(files);
          }
        }),
      200
    );
  }

  getFreeContent() {
    this.setState({ counter: 9, hasMore: false, price: 0, type: "free" });
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

  settingCategory() {
    const initialState = { category: "" };
    const token: any = localStorage.getItem("token");
    const { category } = this.state;
    const { setFiles } = this.props;
    setTimeout(
      ({ token } = this.props.account, { setFiles } = this.props) =>
        myFetch({ path: `/multimedia/byCategory/${category}`, token }).then(
          files => {
            console.log("entri");
            console.log(files);
            if (files) {
              setFiles(files);
            }
          }
        ),
      200
    );
    this.setState(initialState);
  }

  //GET MORE FILES
  settingMoreFiles() {
    console.log("more fiiiilesss!!");
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
        {/* 
          <div className="row mb-2 mt-2">
            <div className="col-8 ">
              <div className="btn-group search-group">
                <button
                  className="btn btn-sm btn-default btn-sorteable"
                  onClick={() => this.settingFiles("")}
                >
                  All <i className="fa fa-sort"></i>
                </button>
                <button
                  className="btn btn-sm btn-default btn-sorteable"
                  onClick={() => this.settingFiles("article")}
                >
                  Articles <i className="fa fa-sort"></i>
                </button>
                <button
                  className="btn btn-sm btn-default btn-sorteable"
                  onClick={() => this.settingFiles("image")}
                >
                  Images <i className="fa fa-sort"></i>
                </button>
                <button
                  className="btn btn-sm  btn-sorteable"
                  onClick={() => this.settingFiles("video")}
                >
                  Videos <i className="fa fa-sort"></i>
                </button>
                <button
                  className="btn btn-sm btn-default btn-sorteable filterButton"
                  onClick={() => this.getFreeContent()}
                >
                  Free <i className="fa fa-sort"></i>
                </button>
                <select
                  className="form-control"
                  style={{ width: "9rem" }}
                  data-spy="scroll"
                  value={this.state.category}
                  onChange={e => this.setState({ category: e.target.value })}
                  onClick={this.settingCategory}
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

                <div className="col-2">
                  <Filter parent={"home"}></Filter>
                </div>
                <div className="col-2">
                </div>
              </div>
            </div>
          </div> */}
        <div className="container ">
          <div className="row mt-4 mb-5">
            <div className="col-sm-4  col-12 mt-3">
              <i className="fas fa-search"></i>
              <div className="btn-group search-group">
                <button
                  className={type === ''?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("")}
                >
                  All
                </button>
                <button
                  className={type === 'article'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("article")}
                >
                  Articles 
                </button>
                <button
                  className={type === 'image'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  // style={{borderBottom: type === 'image'? '2px solid red': ''}}
                  onClick={() => this.settingFiles("image")}
                >
                  Images 
                </button>
                <button
                  className={type === 'video'?'btn btn-sm selectedFilter': "btn btn-sm"}
                  onClick={() => this.settingFiles("video")}
                >
                  Videos 
                </button>
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
                style={{ width: "11rem" }}
                data-spy="scroll"
                value={this.state.category}
                onChange={e => this.setState({ category: e.target.value })}
                onClick={this.settingCategory}
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
            <div className="col-sm-3 col-6 mt-3">
              <Filter parent={"home"}></Filter>
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
