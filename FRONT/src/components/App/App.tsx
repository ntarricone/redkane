import React from 'react';
import './App.css';
import AppUnlogged from './AppUnlogged';


interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class App extends React.PureComponent<TProps>{
  render(){
    return(
      <>
    <AppUnlogged></AppUnlogged>
    {/* <UploadMultimedia></UploadMultimedia> CREAR COMPONENTE*/}
    
      </>
    )
  }
}

export default App;
