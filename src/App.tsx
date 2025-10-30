import React, { useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useNavigate,
} from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  publishDate: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Khám phá',
    author: 'Trần Văn An',
    content: 'Nhật Bản',
    category: 'Du lịch',
    publishDate: '25/10/2025',
  },
  {
    id: '2',
    title: 'Đánh giá React',
    author: 'Nguyễn Thị Bình',
    content: 'React 19',
    category: 'Công nghệ',
    publishDate: '24/10/2025',
  },
  {
    id: '3',
    title: 'Bí quyết',
    author: 'Lê Văn Cường',
    content: 'Nấu một bát phở bò',
    category: 'Ẩm thực',
    publishDate: '23/10/2025',
  },
];

function Navbar() {
  return (
    <nav>
      <Link to="/">Blog.React</Link>
      <div style={{ display: 'inline', marginLeft: '20px' }}>
        <NavLink to="/" end style={{ marginRight: '10px' }}>
          Trang chủ
        </NavLink>
        <Link to="/create">
          <button>Viết bài mới</button>
        </Link>
      </div>
    </nav>
  );
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

function PostCard({ post, onDelete }: PostCardProps) {
  const shortContent = post.content.substring(0, 100) + '...';

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      onDelete(post.id); 
      alert('Đã xóa bài viết!');
    }
  };

  return (
    <article style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <div>
        <Link to={`/posts/${post.id}`}>
          <h2>{post.title}</h2>
        </Link>
        <div>
          <span>
            <strong>Tác giả:</strong> {post.author}
          </span>
          <br />
          <span>
            <strong>Ngày:</strong> {post.publishDate}
          </span>
        </div>
        <p>{shortContent}</p>
        <div>
          <Link to={`/posts/${post.id}`}>
            <button>Đọc thêm</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
            Xóa
          </button>
        </div>
      </div>
    </article>
  );
}

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
}

function PostList({ posts, onDelete }: PostListProps) {
  return (
    <section>
      <header>
        <div>
          <h2>Danh sách bài viết</h2>
          <span>Tổng số: {posts.length} bài viết</span>
        </div>
      </header>
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

interface PostDetailProps {
  posts: Post[];
  onDelete: (id: string) => void;
}

function PostDetail({ posts, onDelete }: PostDetailProps) {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate(); 
  const post = posts.find((p) => p.id === id); 

  if (!post) {
    return (
      <div>
        <h2>Không tìm thấy bài viết</h2>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  const handleDeleteClick = () => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      onDelete(post.id);
      navigate('/'); 
      alert('Đã xóa bài viết!');
    }
  };

  return (
    <article>
      <div>
        <Link to="/">
          <button>&larr; Quay lại</button>
        </Link>
        <Link to={`/posts/edit/${post.id}`}>
          <button>Chỉnh sửa</button>
        </Link>
        <button onClick={handleDeleteClick}>Xóa bài viết</button>
      </div>

      <h1>{post.title}</h1>
      <div>
        <span>
          <strong>Tác giả:</strong> {post.author}
        </span>
        <br />
        <span>
          <strong>Ngày đăng:</strong> {post.publishDate}
        </span>
        <br />
        <span>
          <strong>Thể loại:</strong> {post.category}
        </span>
      </div>
      <hr />
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
    </article>
  );
}
interface PostFormProps {
  posts: Post[];
  onSave: (post: Post) => void;
}

function PostForm({ posts, onSave }: PostFormProps) {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const isEditing = !!id;
  const initialPost = isEditing ? posts.find((p) => p.id === id) : undefined;

  const [title, setTitle] = useState(initialPost?.title || '');
  const [author, setAuthor] = useState(initialPost?.author || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [category, setCategory] = useState(
    initialPost?.category || 'Công nghệ'
  );
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const publishDate =
      initialPost?.publishDate || new Date().toLocaleDateString('vi-VN');
    const postId = id || Date.now().toString();

    const postData: Post = {
      id: postId,
      title,
      author,
      content,
      category,
      publishDate,
    };

    onSave(postData); 

    if (isEditing) {
      alert('Cập nhật bài viết thành công!');
      navigate(`/posts/${postId}`); 
    } else {
      alert('Đăng bài thành công!');
      navigate('/'); 
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/posts/${id}`);
    } else {
      navigate('/'); 
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Tiêu đề</label> <br />
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="author">Tác giả</label> <br />
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="content">Nội dung bài viết</label> <br />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            style={{ width: '300px' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="category">Thể loại</label> <br />
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Công nghệ</option>
            <option>Du lịch</option>
            <option>Ẩm thực</option>
            <option>Đời sống</option>
            <option>Khác</option>
          </select>
        </div>

        <div>
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
          <button type="submit" style={{ marginLeft: '10px' }}>
            {isEditing ? 'Cập nhật' : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handleSavePost = (postToSave: Post) => {
    const isEditing = posts.some((p) => p.id === postToSave.id);
    if (isEditing) {
      setPosts(
        posts.map((p) => (p.id === postToSave.id ? postToSave : p))
      );
    } else {
      setPosts([postToSave, ...posts]);
    }
  };
  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <HashRouter>
      <Navbar />
      <hr />
      <main>
        <Routes>
          <Route
            path="/"
            element={<PostList posts={posts} onDelete={handleDelete} />}
          />
          <Route
            path="/posts"
            element={<PostList posts={posts} onDelete={handleDelete} />}
          />
          <Route
            path="/create"
            element={<PostForm posts={posts} onSave={handleSavePost} />}
          />
          <Route
            path="/posts/:id"
            element={<PostDetail posts={posts} onDelete={handleDelete} />}
          />
          <Route
            path="/posts/edit/:id"
            element={<PostForm posts={posts} onSave={handleSavePost} />}
          />
          <Route path="*" element={<h2>404 - Trang không tồn tại</h2>} />
        </Routes>
      </main>
    </HashRouter>
  );
}

