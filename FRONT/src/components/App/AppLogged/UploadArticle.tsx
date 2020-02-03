import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


interface IProps{}
interface IState {
  
}

// function CreatePage(props) {
//   const user = useSelector(state => state.user);

//   const [content, setContent] = useState("")
//   const [files, setFiles] = useState([])

//   const onEditorChange = (value) => {
//       setContent(value)
//       console.log(content)
//   }

//   const onFilesChange = (files) => {
//       setFiles(files)
//   }

//   const onSubmit = (event) => {
//       event.preventDefault();

//       setContent("");

//       if (user.userData && !user.userData.isAuth) {
//           return alert('Please Log in first');
//       }

//       const variables = {
//           content: content,
//           userID: user.userData._id
//       }

//       axios.post('/api/blog/createPost', variables)
//           .then(response => {
//               if (response) {
//                   message.success('Post Created!');

//                   setTimeout(() => {
//                       props.history.push('/blog')
//                   }, 2000);
//               }
//           })
//   }
class UploadArticle extends React.PureComponent<IProps, IState> {
  // static modules: { toolbar: (string[] | ({ header: string; font?: undefined; } | { font: never[]; header?: undefined; })[] | { size: never[]; }[] | { list: string; }[])[]; };
  // static formats: string[];
  // constructor(props:any) {
  //   super(props);
  //   this.state = {
  //     title: '',
  //     body: '',
  //     posts: {}
  //   };
  //   // bind
  //   this.onHandleChange = this.onHandleChange.bind(this);
  //   this.onHandleSubmit = this.onHandleSubmit.bind(this);
    
  // }

  // onHandleChange(e) {
  //   this.setState({ body: e });
  //   console.log(this.state.body);
  // }

  // onHandleSubmit(e) {
  //   e.preventDefault();
  //   const post = {
  //     title: this.state.title,
  //     body: this.state.body
  //   };
  //   database.push(post);
  //   this.setState({
  //     title: '',
  //     body: ''
  //   });
  // }

  // render() {
  //   return (
  //     <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
  //     <div style={{ textAlign: 'center' }}>
  //         <h2 > Editor</h2>
  //     </div>
  //     <QuillEditor
  //         placeholder={"Start an Article"}
  //         onEditorChange={onEditorChange}
  //         onFilesChange={onFilesChange}
  //     />

      
  //         <div style={{ textAlign: 'center', margin: '2rem', }}>
  //             <button
  //                 className="btn text-light registerButton btn-block my-2 my-sm-0"
  //                 onSubmit={this.onSubmit}
  //             >
  //                 Submit
  //         </button>
  //         </div>
      
  // </div>
  //   );
  }
//   renderPosts(): React.ReactNode {
//     throw new Error("Method not implemented.");
//   }
// }

// UploadArticle.modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     ['link', 'image', 'video'],
//     ['clean'],
//     ['code-block']
//   ]
// };

// UploadArticle.formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'link',
//   'image',
//   'video',
//   'code-block'
// ];


export default UploadArticle;

// https://github.com/jaewonhimnae/quill-editor-blog/blob/master/client/src/components/views/BlogPage/Section.js/CreatePage.js