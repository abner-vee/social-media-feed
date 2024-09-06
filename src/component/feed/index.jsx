import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import LoadingSpinner from "../spinner/index.jsx";
import Post from "../post/index.jsx";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
                params: { _limit: 10, _page: page },
            });
            setPosts((prevPosts) => [...prevPosts, ...res.data]);
            setHasMore(res.data.length > 0);
        } catch (error) {
            console.error("Error fetching posts", error);
        } finally {
            setLoading(false);
        }
    };

    const lastPostRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="feed">
            {posts.map((post, index) => {
                if (index === posts.length - 1) {
                    return <Post ref={lastPostRef} key={post.id} post={post} />;
                } else {
                    return <Post key={post.id} post={post} />;
                }
            })}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Feed;
