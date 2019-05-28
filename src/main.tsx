import axios from "axios";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import { getTheme, Icon, IStyle, ITheme, Link, mergeStyleSets } from "office-ui-fabric-react";
import * as React from "react";



export interface UploadProps {
  className?: string
  theme?: ITheme
  onAfterUpload?: (props: UploadProps) => void
}

export interface UploadStyleProps {
  className?: string
  theme?: ITheme
}

export interface UploadStyles {
  root?: IStyle
  content?: IStyle
}

let theme = getTheme()

export const UploadStylesheet =  mergeStyleSets({
    root: [
      "upload-input",
      {
        position: "relative",
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.neutralLight,
        borderRadius: 4,
        selectors: {
          "&.upload-drag-over": {
            selectors: {
              $content: {
                backgroundColor: theme.palette.themeLight
              }
            }
          }
        }
      }
    ],
    content: [
      "upload-input-content",
      {
        position: "absolute",
        top: 8,
        right: 8,
        bottom: 8,
        left: 8,
        border: `1px dashed ${theme.palette.neutralTertiary}`,
        borderRadius: 4,
        backgroundColor: theme.palette.white,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        whiteSpace: "pre-wrap"
      }
    ]
  })


class FormValue {
  @observable
  formData = new FormData()

  @action doThing = () => this.formData.append
  accepted = observable.array()

  @observable
  rejected: []

  @action
  acceptFile = () => this.accepted.map((file, idx) => {})

  @action
  uploadImmediate = (file: File) => {
    this.formData.append(file.name, file)

    axios.post("http://localhost:3000/fileupload", this.formData).then((result) => {
      console.log(result)
    })
  }

  @action
  uploadAcceptedFiles = () =>
    this.accepted.map((file, idx) => {
      //e.preventDefault()

      this.formData.append("file" + idx, file)

      axios.post("http://localhost:3000/fileupload", this.formData).then((result) => {
        console.log(result)
      })
    })
}

@observer
export class FileUploader extends React.Component<UploadProps, any> {
   _fileInputRef: HTMLInputElement

  formState = new FormValue()

   _onInputChange = (e) => {
    const fileList = this._fileInputRef.files

    if (fileList.length > 0) {
      // upload the file via the model
      this.formState.accepted.push(fileList.item(0))
      this.formState.uploadImmediate(fileList.item(0))
    }
  }

   _onFileInputRef = (ref: HTMLInputElement) => {
    this._fileInputRef = ref
  }
   _onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }
   _onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files.item(0)
      this.formState.uploadImmediate(file)
    }
  }

  _onClickSelectPackage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    try {
      this._fileInputRef.click()
    } catch (e) {}
  }

  render() {
    return (
      <div className={UploadStylesheet.root} onDragOver={this._onDragOver} onDrop={this._onDrop}>
        <input
          type="file"
          accept=".zip, .tar.gz, .tgz, .jpg, .png, .svg"
          onChange={this._onInputChange}
          ref={this._onFileInputRef}
          value=""
          hidden={true}
          style={{ display: "none" }}
        />

        <div className={UploadStylesheet.content}>
          <Icon iconName="CloudUpload" /> Drop a file here or <Link onClick={this._onClickSelectPackage}>select a file</Link>
        </div>
      </div>
    )
  }
}


export let App = () => {
  return <div><FileUploader/></div>
}


// export const ListingUpload: React.FC<UploadProps> = styled<
//   IListingUploadProps,
//   IListingUploadStyleProps,
//   IListingUploadStyles
// >(ListingUploadBase, getStyles, undefined, {
//   scope: "ListingUpload"
// })

// export let FileUploader = ListingUpload


// {
//     listing.saveSync.syncing && (
//   <div className={classNames.content}>
//     <Spinner size={SpinnerSize.small} />{" "}
//     {listing.saveSync.type === "upload"
//       ? " Uploading Package..."
//       : " Saving Listing..."}
//   </div>
// )
// }
// {!listing.saveSync.syncing && (
//   <div className={classNames.content}>
//     <Icon iconName="CloudUpload" /> Drop a package here or{" "}
//     <Link onClick={this._onClickSelectPackage}>select a package</Link>
//   </div>
// )}

// import Dropzone from "react-dropzone";
// import axios from "axios";
// export class FileUploader extends React.Component<any, any>{
//     constructor(props: any) {
//         super(props);

//         this.state = {
//             accepted: [],
//             rejected: []
//         }

//         this.onDrop = this.onDrop.bind(this);
//         this.uploadFile = this.uploadFile.bind(this);
//     }

//     uploadFile(e) {
//         e.preventDefault();

//         let formData = new FormData();

//         this.state.accepted.map((file, idx) => {
//             formData.append('file' + idx, file);
//         })

//         axios.post('/fileupload', formData)
//             .then((result) => {
//                 console.log(result);
//             });

//         this.setState({
//             accepted: [],
//             rejected: []
//         })
//     }

//     onDrop(accepted: File[], rejected: File[]) {
//         if (accepted) {
//             this.setState({ accepted: [...this.state.accepted, ...accepted] })
//         }

//         if (rejected) {
//             this.setState({ rejected: [...this.state.rejected, ...rejected] })
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop}></Dropzone>
//                 <div>
//                     <h5>Accepted Files</h5>
//                     <ul style={{ listStyle: "none" }}>
//                         {
//                             this.state.accepted.length > 0 ? this.state.accepted.map((file) => {
//                                 return <li key={file.name}>{file.name}</li>
//                             }) : null
//                         }
//                     </ul>
//                 </div>
//                 <div>
//                     <h5>Rejected Files</h5>
//                     <ul style={{ listStyle: "none" }}>
//                         {this.state.rejected.length > 0 ? this.state.rejected.map((file) => {
//                             return <li key={file.name}>{file.name}</li>
//                         }) : null}
//                     </ul>
//                 </div>
//                 <button type="button" onClick={this.uploadFile}>Upload</button>
//             </div>
//         );
//     }
// }

// export default FileUploader
