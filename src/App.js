import React,{Component} from 'react';
import './App.css';
import { Button, Upload, Icon, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import "cropperjs/dist/cropper.css"
import Cropper from 'react-cropper'

// 组件接收onSubmit函数
export default class ImgCropper extends Component{

  constructor(props){
    super(props);
    this.state = {
      imgUrl:'',
      CopperimgUrl:'',
      modalVisible: false,
      updateloading:false
    }
  }

  onImgSubmit = (e)=>{
    this.getBase64(e.target.files[0], imageUrl =>
      this.setState({
        CopperimgUrl:imageUrl,
        modalVisible:true
      }),
    )
  }

  handleChange = info => {

    if (info.file.status === 'uploading') {
      this.setState({ updateloading: true });
    }

    this.getBase64(info.file.originFileObj, imageUrl =>
      this.setState({
        CopperimgUrl:imageUrl,
        updateloading: false,
        // modalVisible:true
      }),
    )
  }

  getBase64 = (img, callback)=>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file)=>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅能上传jpg/png格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('请上传小于2M的图片');
    }
    return isJpgOrPng && isLt2M;
  }

  cropperModal = ()=>{

    const {modalVisible,updateloading} = this.state;

    return(
      <div>
        <Modal
          visible={modalVisible}
          closable={false}
          footer={[
            <Button size="default" key="back" onClick={()=>this.setState({modalVisible:false})}>
              取消
            </Button>,
            <Button size="default" key="submit" type="primary" loading={updateloading} onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
        <div className="cropperContainer">
          <div className="container">
              <Cropper
                src={this.state.CopperimgUrl}
                className="cropper"
                ref={cropper => (this.cropper = cropper)}
                // Cropper.js options
                viewMode={1}
                zoomable={false}
                zoomOnWheel={false}
                dragCrop={false} 
                cropBoxResizable={false} //裁剪框不可缩放大小
                movable={false} //背景不可移动
                autoCropArea={.6} //初始化裁剪区域大小
                aspectRatio={1} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
                preview=".cropperPreview"
              />
            </div>
            <div className="preview">
              <div className="cropperPreview" />
              <div className="cropperPreview" />
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  handleOk = ()=>{
    const imgUrl = this.cropper.getCroppedCanvas().toDataURL();
    const imgBlobUrl = this.dataURLToBlob(imgUrl);
    this.props.onSubmit && this.props.onSubmit(imgUrl,imgBlobUrl)
    this.setState({
      imgUrl,
      modalVisible:false
    })
  }

  dataURLToBlob = (dataurl)=>{
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  customRequest = ()=>{
    this.setState({
      modalVisible:true
    })
  }

  render(){
    const {imgUrl,updateloading} = this.state;
    const uploadButton = (
      <div>
        <Icon type={updateloading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return(
      <>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={this.customRequest}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
        >
          {imgUrl ? <img src={imgUrl} alt="用户头像" style={{ width: '100px' }} /> : uploadButton}
        </Upload>
        {this.cropperModal()}

      {/* <input type="file" onChange={this.onImgSubmit} /> */}
      </>
    )
  }

}