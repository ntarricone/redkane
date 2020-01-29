import React from 'react';
import './App.css';
import AppUnlogged from './AppUnlogged';
import UploadMultimedia from './UploadMltimedia'


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class App extends React.PureComponent<TProps>{
  render(){
    return(
      <>
    {/* <AppUnlogged></AppUnlogged> */}
    <UploadMultimedia />
    
      </>
    )
  }
}

export default App;
