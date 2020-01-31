import React from "react";
import ContentUploader from "../../shared/ContentUploader/ContentUploader";
import ArticlesView from "./MultimediaViews/ArticlesView";
import ImagesView from "./MultimediaViews/ImagesView";
import VideosView from "./MultimediaViews/VideosView";
import Filter from "../../shared/Filter/Filter";
import AppUnlogged from "../AppUnlogged/AppUnlogged";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import AppLogged from "./AppLogged";

interface IGlobalStateProps {}

interface IState {
  selectedView: "articles" | "images" | "videos";
}

type TProps = IGlobalStateProps;

class Home extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      selectedView: "articles"
    };
  }
  render() {
    const token = localStorage.getItem("token");
    return (
      <>
      {/* {!token && <AppUnlogged></AppUnlogged>} 
        <UpdateProfile></UpdateProfile>
        { token && <AppLogged></AppLogged>} */}
        <div className="continer-fluid">
          <div className="row">
            <div className="col-12 col-sm d-flex justify-content-center mt-5">
              <ContentUploader></ContentUploader>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="mt-4" style={{ width: "30rem" }}>
              <input
                type="text"
                placeholder="Search content..."
                className="form-control"
              />
            </div>
          </div>
          <div className="row ">
            <div className="col-12 d-flex justify-content-center mt-4">
           
              <Filter></Filter>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="filter-nav d-flex justify-content-center mt-4">
                <button className="btn btn-primary" data-filter="nature">
                  Nature
                </button>
                <button className="btn btn-primary" data-filter="food">
                  Food
                </button>
                <button className="btn btn-primary" data-filter="architecture">
                  Architecture
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="col-6 pt-3">
                <div className="btn-group ">
                  <button className="btn btn-sm btn-default btn-sorteable">
                    Fecha <i className="fa fa-sort"></i>
                  </button>
                  <button className="btn btn-sm btn-default btn-sorteable">
                    Costo <i className="fa fa-sort"></i>
                  </button>
                  <button className="btn btn-sm btn-default btn-sorteable">
                    Tipo de Contenido <i className="fa fa-sort"></i>
                  </button>
                  <button className="btn btn-sm btn-default btn-sorteable">
                    Vistas <i className="fa fa-sort"></i>
                  </button>
                  <button className="btn btn-sm btn-default btn-sorteable">
                    Credibilidad <i className="fa fa-sort"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ArticlesView></ArticlesView>
          <ImagesView></ImagesView>
          <VideosView></VideosView>
        </div>
      </>
    );
  }
}

export default Home;
