import { capitalizeFirstLetter, checkPeriod } from './utils.js';
import { getPostData } from './api.js';

function createPostCard(posts, postsContainer, headerIconHTML) {
    posts.forEach(post => {
        // check if post content is valid and log error if any required field is missing for debugging
        if (!post.id || !post.title || !post.body) {
        console.error(`Post data is missing one or more fields:
            Title: ${post.title}
            Body: ${post.body}
            ID: ${post.id}
        `);
        return; // exit current iteration if required field(s) are missing
    }

        // add post card element with title, description, and a favorite icon
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.dataset.id = post.id; // add data-id attribute to .post element
        if (headerIconHTML === '') {
            postElement.innerHTML = `
            <h3 class='post-title'>${capitalizeFirstLetter(post.title)}</h3>
            <p class='post-body'>${checkPeriod(capitalizeFirstLetter(post.body))}</p>
        `;
        } else {
            postElement.innerHTML = `
            <div class='post-header'>
            <h3 class='post-title'>${capitalizeFirstLetter(post.title)}</h3>
            ${headerIconHTML}
            </div>
            <p class='post-body'>${checkPeriod(capitalizeFirstLetter(post.body))}</p>
        `;
        }
        postsContainer.appendChild(postElement);
    });
}

function markFavoritedPosts(postsContainer) {
    let favoritedPosts = JSON.parse(localStorage.getItem('favoritedPosts')) || []; // get favorited posts from localStorage or initialize empty array
    postsContainer.querySelectorAll('.post').forEach(post => {
        if (favoritedPosts.includes(post.dataset.id)) {
            post.querySelector('.favorite-icon').classList.add('favorited');
        }
    });
}

function removeFavoritedPosts(postID) {
    let favoritedPosts = JSON.parse(localStorage.getItem('favoritedPosts')) || [];
    favoritedPosts = favoritedPosts.filter(id => id !== postID); // remove post from favorited list
    localStorage.setItem('favoritedPosts', JSON.stringify(favoritedPosts)); // save updated favorited posts to localStorage
}

async function displayFeedPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // clear posts container before displaying feed posts

    // fetch data from API and log it for debugging
    const posts = await getPostData();

    // create post cards and append them to #posts-container
    createPostCard(posts, postsContainer,  `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 favorite-icon">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
        </svg>`);

    // load favorite posts from localStorage and mark them as favorited (change star to golden)
    markFavoritedPosts(postsContainer);
}

async function displayFavoritePosts() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritedPosts = JSON.parse(localStorage.getItem('favoritedPosts')) || []; // get favorited posts from localStorage or initialize empty array
    const allPosts = await getPostData(); // fetch all posts from API
    const favoritePosts = allPosts.filter(post => favoritedPosts.includes(post.id.toString())); // filter posts to get only favorited posts (convert post.id to string for comparison with favoritedPosts array)
    favoritesContainer.innerHTML = ''; // clear favorites container before displaying favorite posts
    createPostCard(favoritePosts, favoritesContainer, `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="size-6 delete-icon">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>`); // create post cards for favorite posts and append them to #favorites-container
    document.querySelector('.feed-section').style.display = 'none'; // hide feed section
    document.querySelector('.favorites-section').style.display = 'block'; // show favorites section
}

// function to handle search input and highlight matching posts
async function highlightMatchingContent(searchTerm) {
    document.querySelectorAll('.post').forEach(post => {
        const title = post.querySelector('.post-title');
        const body = post.querySelector('.post-body');
        if (title.textContent.toLowerCase().includes(searchTerm.toLowerCase()) || body.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            title.innerHTML = title.textContent.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
            body.innerHTML = body.textContent.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
            post.style.display = 'block'; // show post if it matches search term
        } else {
            post.style.display = 'none'; // hide post if it doesn't match search term
        }
    });
}


// event listener to #favorites-container to handle click events on favorite navbar button
document.getElementById('favorites').addEventListener('click', () => {
    displayFavoritePosts();
});

// event listener to #favorites-container to handle click events on feed navbar button
document.getElementById('feed').addEventListener('click', () => {
    displayFeedPosts();
    document.querySelector('.feed-section').style.display = 'block'; // show feed section
    document.querySelector('.favorites-section').style.display = 'none'; // hide favorites section
});

// event listener to #favorites-container to handle click events on app-title/ logo
document.getElementById('app-title').addEventListener('click', () => {
    document.querySelector('.feed-section').style.display = 'block'; // show feed section
    document.querySelector('.favorites-section').style.display = 'none'; // hide favorites section
});

// event listener to open modal when clicking on delete icon in favorites section
document.getElementById('favorites-container').addEventListener('click', (event) => {
    const targetDelete = event.target.closest('.delete-icon'); // get the clicked delete icon element
    if (!targetDelete) {
        console.log('No delete icon found in clicked element.'); // log message for debugging
        return;
    }; // exit if no delete icon element is found
    const modal = document.getElementsByClassName('modal-background')[0]; // get the modal element
    const postID = event.target.closest('.post').dataset.id; // get post ID from element data-id attribute
    modal.classList.remove('hidden');
    // close modal if click is outside of modal content
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
    // remove post from favorites in localStorage, update favorites display and close modal if click is on confirm button
    document.getElementById('modal-confirm').addEventListener('click', () => {
        removeFavoritedPosts(postID);
        displayFavoritePosts();
        modal.classList.add('hidden');
    });
    // close modal if click is on cancel button
    document.getElementById('modal-cancel').addEventListener('click', () => {
        modal.classList.add('hidden'); 
    });
    // close modal if click is on close modal button
    document.getElementById('modal-close').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});

// event listener to open search bar when clicking on search button
document.getElementById('search-icon').addEventListener('click', () => {
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    searchInputWrapper.classList.toggle('search-closed');
});

// event listener to clear search input when clicking on clear button
document.getElementById('clear-search').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    displayFeedPosts(); // reset feed posts to show all posts when search input is cleared
});

// event listener to handle search input and highlight matching posts
document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    highlightMatchingContent(searchTerm);
});

displayFeedPosts();


