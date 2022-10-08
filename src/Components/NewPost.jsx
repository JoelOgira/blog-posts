const NewPost = ({
  postTitle, setPostTitle, postBody, setPostBody, handleSubmit
}) => {
  return (
    <main className="container">
        <h1>New Post</h1>
        <form className="newFormPost p-4 form-control" onSubmit={handleSubmit}>
          <label htmlFor="postTitle" className="text-teal">Title </label>
          <input 
            id="postTitle"
            type="text" 
            className="form-control mb-4"
            required
            value={postTitle}
            onChange={e => setPostTitle(e.target.value)}
          />
          <label htmlFor="postBody" className="text-teal">Post </label>
          <textarea 
            id="postBody"
            className="form-control mb-4" 
            required
            value={postBody}
            onChange={e => setPostBody(e.target.value)}
          />
          <button type="submit" style={{width: '100%'}} className="btn btn-outline-success text-teal">Post</button>
        </form>
    </main>
  )
}

export default NewPost;