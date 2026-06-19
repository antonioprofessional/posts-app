export async function getPostData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await response.json();
        return posts.slice(0, 10); // get only the first 10 posts
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}