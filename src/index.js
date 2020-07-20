import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ImgCropper from './App'

class Index extends Component{

  constructor(){

    super()

    this.state = ({
      imgUrl:'',
      imgBlobUrl:''
    })
  }

  onSubmit = (imgUrl='',imgBlobUrl='')=>{
    this.setState({
      imgUrl,
      imgBlobUrl
    })
  }

  render(){
    return(
      <>
        <ImgCropper onSubmit = {this.onSubmit}/>
        <img src={this.state.imgUrl}/>
      </>
    )
  }
}

ReactDOM.render(
    <Index />,
  document.getElementById('root')
);

