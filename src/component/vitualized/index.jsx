// eslint-disable-next-line no-unused-vars
import React, { useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import Post from "../post/index.jsx";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import LoadingSpinner from "../spinner/index.jsx";

const fetchPosts = async (limit, offset) => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts', {
        params: { _limit: limit, _start: offset }, // Fetch posts with pagination
    });
    return data;
};

const VirtualizedFeed = () => {
    const [offset, setOffset] = React.useState(0);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const observer = useRef();

    const { data: posts = [], isLoading, isFetching } = useQuery({
        queryKey: ['posts', offset], // Use offset as part of the query key
        queryFn: () => fetchPosts(20, offset), // Fetch 20 posts at a time
        enabled: true,
        onSuccess: async () => {
            // Introduce a delay before setting the posts
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
        },
    });

    // Load more posts when the observer detects the last item
    const lastPostRef = React.useCallback(node => {
        if (loadingMore) return; // Prevents multiple loads
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setLoadingMore(true);
                setOffset(prevOffset => prevOffset + 20); // Load more posts
                setLoadingMore(false);
            }
        });

        if (node) observer.current.observe(node);
    }, [loadingMore]);

    // Handle scroll up to load older posts
    const topPostRef = React.useCallback(node => {
        if (loadingMore) return; // Prevents multiple loads
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setLoadingMore(true);
                setOffset(prevOffset => Math.max(prevOffset - 20, 0)); // Load previous posts, prevent negative offset
                setLoadingMore(false);
            }
        });

        if (node) observer.current.observe(node);
    }, [loadingMore]);

    // Show spinner if loading or fetching
    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="w-3/5"> {/* Width 60% using Tailwind */}
                <List
                    height={768}
                    margin={5}
                    itemCount={posts.length}
                    itemSize={100}
                    width={'100%'}
                >
                    {({ index, style }) => {
                        const postProps = {
                            style,
                            post: posts[index]
                        };

                        // Attach ref to the last post to observe
                        if (index === posts.length - 1) {
                            return <div ref={lastPostRef}><Post {...postProps} /></div>;
                        }

                        // Attach ref to the first post to observe
                        if (index === 0) {
                            return <div ref={topPostRef}><Post {...postProps} /></div>;
                        }

                        return <Post {...postProps} />;
                    }}
                </List>
                {loadingMore && <LoadingSpinner />} {/* Show spinner while loading more */}
            </div>
        </div>
    );
};

export default VirtualizedFeed;
