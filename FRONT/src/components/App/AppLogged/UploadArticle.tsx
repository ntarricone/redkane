import React from "react";
import ReactDOM from 'react-dom';
import { IStore } from "../../../interfaces/IStore";
import { myFetch } from "../../../utils";
import { connect } from "react-redux";
import { IAccount } from "../../../interfaces/IAccount";
import {Editor, EditorState } from "draft-js";

interface IState {
 
    
  editorState: any;
}




class UploadArticle extends React.PureComponent<any, IState> {
 
  constructor(props: any) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    

  }

  
  render() {
    //TODO controlar el imput tipe price. Scroll en el select
    return (
      
       
        
       <Editor editorState={this.state.editorState} onChange={editorState => this.setState({editorState})} />
        

       
      
    );
  }
  
}
// ReactDOM.render(<UploadArticle />, document.getElementById('container'));


export default UploadArticle;
