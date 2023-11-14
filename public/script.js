// 获取最新帖子
fetch('/api/latest-posts')
    .then(response => response.json())
    .then(posts => {
        const latestPostsList = document.getElementById('latest-posts-list');
        latestPostsList.innerHTML = posts.map(post => `<li><a href="/post/${post.id}">${post.title}</a></li>`).join('');
    });

// 获取热门帖子
fetch('/api/popular-posts')
    .then(response => response.json())
    .then(posts => {
        const popularPostsList = document.getElementById('popular-posts-list');
        popularPostsList.innerHTML = posts.map(post => `<li><a href="/post/${post.id}">${post.title}</a></li>`).join('');
    });

// 获取帖子列表
fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        const postList = document.getElementById('post-list');
        postList.innerHTML = posts.map(post => `<div class="post"><h3><a href="/post/${post.id}">${post.title}</a></h3><p>${post.content}</p></div>`).join('');
    });

// 获取帖子详情
if (window.location.pathname.startsWith('/post/')) {
    const postId = window.location.pathname.split('/').pop();
    fetch(`/api/post/${postId}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('post-title').innerText = post.title;
            document.getElementById('post-content').innerHTML = `<p>${post.content}</p><p>作者: ${post.author}</p>`;
        });
}

// 获取当前用户信息
fetch('/api/user')
    .then(response => response.json())
    .then(user => {
        document.getElementById('username').innerText = user.username;
    });
