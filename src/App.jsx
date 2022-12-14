import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from './api/posts';
import { format } from 'date-fns';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Home from './Components/Home';
import About from './Components/About';
import NewPost from './Components/NewPost';
import PostPage from './Components/PostPage';
import Missing from './Components/Missing';
import EditPost from './Components/EditPost';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

const App = () => {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState(''); 
  const [editTitle, setEditTitle] = useState(''); 
  const [editBody, setEditBody] = useState(''); 
  const history = useNavigate();
  const { width } = useWindowSize();
  const { data, isLoading, fetchError } = useAxiosFetch(`http://localhost:3500/posts`);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  useEffect(() => {
    const filteredResults = posts.filter(post => ((post.title).toLowerCase().includes(search.toLowerCase())) 
    || ((post.body).toLowerCase().includes(search.toLowerCase())));
    setSearchResults(filteredResults.reverse());
  }, [posts, search])


  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const myNewPost = {id, title: postTitle, datetime, body: postBody};
    try {
      const response = await api.post('/posts', myNewPost);
      const AllPosts = [...posts, response.data];
      setPosts(AllPosts);
      setPostTitle('');
      setPostBody('');
      history('/');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  const handleEdit = async id => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = {id, title: editTitle, datetime, body: editBody};
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      history('/');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postList = posts.filter(post => post.id !== id);
      setPosts(postList);
      history('/');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  return (
    <div className="App container">
      <Header 
        search={search}
        setSearch={setSearch}
        width={width}
      />
      <Routes>
        <Route path='/' element={<Home posts={searchResults} isLoading={isLoading} fetchError={fetchError}/>}/>
        <Route path='/post' element={<NewPost handleSubmit={handleSubmit} postTitle={postTitle} setPostTitle={setPostTitle} postBody={postBody} setPostBody={setPostBody} />}/>
        <Route path='/edit/:id' element={<EditPost posts={posts} handleEdit={handleEdit} editTitle={editTitle} setEditTitle={setEditTitle} editBody={editBody} setEditBody={setEditBody}/>}/>
        <Route path='/post/:id' element={<PostPage posts={posts} handleDelete={handleDelete} />}/>
        <Route path='/about' element={<About />}/>
        <Route path='*' element={<Missing />}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
