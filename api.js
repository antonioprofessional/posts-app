let cachedPosts = [];

export async function getPostData() {
    if (cachedPosts.length > 0) {
        return cachedPosts;
    }
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await response.json();
        cachedPosts = posts.slice(0, 10);
        return cachedPosts;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}