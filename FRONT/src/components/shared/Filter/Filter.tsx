import React from 'react';
import "./Filter.css"
import { myFetch } from '../../../utils';
import MultimediaView from '../../App/AppLogged/MultimediaViews/MultimediaView';
import { IFiles } from '../../../interfaces/IFiles';
import { IFile } from '../../../interfaces/IFile';
import { IStore } from '../../../interfaces/IStore';
import { SetFilesAction, UnsetFilesAction } from '../../../redux/actions';
import { connect } from 'react-redux';


interface IState {
    key:string; 
}
interface IGlobalStateProps {
    files: IFiles;
  }
  
  interface IGlobalActionProps {
    setFiles(files: IFile[]): void;
    unsetFiles(): void;
  }

type TProps = IGlobalStateProps & IGlobalActionProps;

class Filter extends React.PureComponent<TProps, IState>{
    constructor(props: TProps) {
        super(props)

        this.state = {
            key: ""
        }

        this.search = this.search.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onSearchChange(event: any) {
      const key = event.target.value;
      console.log(key);
      this.setState({ key });
      
    }
    

    search (){
      const initialState = { key: ""};
        const token = localStorage.getItem("token");
        const { key } = this.state;
        const { setFiles } = this.props;
        if(token){
        myFetch({
            method: "POST",
            path: `/multimedia/searchByWord`,
            token,
            json: { key }
          }).then(files => {
            if (files) {
              console.log(files)
               setFiles(files);
              this.setState(files); 
            }
          });
          this.setState(initialState);
        }

    }

  render(){
    const { files } = this.props;
    const { key } = this.state;
    return(
        <>

    <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                   
                    <div className=" search" style={{ width: "27rem" }}>
              <input
                type="text"
                id="myInput"
                placeholder="Search content..."
                className="form-control"
                value={key}
                        onChange={this.onSearchChange}
              />
              
              <button type="button" className="btn btn-danger wrn-btn"
              onClick={() => this.search()}>Search</button>
            </div>
          </div>
                </div>
            </div>
           
</>

    )
  }
}

const mapStateToProps = ({ files }: IStore): IGlobalStateProps => ({
    files
  });
  
  const mapDispatchToProps: IGlobalActionProps = {
    setFiles: SetFilesAction,
    unsetFiles: UnsetFilesAction
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Filter);
