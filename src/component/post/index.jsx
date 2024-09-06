import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";

const Post = ({ post }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
                params: { _limit: 10, _page: page },
            });
            if (res.data.length === 0) {
                setHasMore(false);
            }
            setPosts((prevPosts) => [...prevPosts, ...res.data]);
        } catch (error) {
            setError("Error fetching posts");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
        </div>
    );
};

export default Post;
