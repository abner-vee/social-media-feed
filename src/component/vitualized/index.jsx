import React, {useEffect, useState} from 'react';
import { FixedSizeList as List } from 'react-window';
import Post from "../post/index.jsx";
import axios from "axios";
import LoadingSpinner from "../spinner/index.jsx";

const VirtualizedFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts().then(console.log);
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
                params: { _limit: 100 }, // Fetch a large number of posts
            });
            setPosts(res.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="virtualized-feed">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <List
                    height={500} // Set the height of the visible window
                    itemCount={posts.length} // Total number of items
                    itemSize={100} // Height of each item
                    width={'100%'} // Full width
                >
                    {({ index, style }) => (
                        <div style={style}>
                            <Post post={posts[index]} /> {/* Render only visible posts */}
                        </div>
                    )}
                </List>
            )}
        </div>
    );
};

export default VirtualizedFeed;
