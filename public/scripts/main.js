window.onload = function() {
	//bookmark js
	const bookmarks = document.getElementsByClassName('bookmark');
	[ ...bookmarks ].forEach((bookmark) => {
		bookmark.style.cursor = 'pointer';
		bookmark.addEventListener('click', function(e) {
			let target = e.target.parentElement;

			let headers = new Headers();
			headers.append('Accept', 'Application/JSON');

			let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
				method: 'GET',
				headers,
				mode: 'cors'
			});

			fetch(req)
				.then((res = res.json()))
				.then((data) => {
					if (data.bookmark) {
						target.innerHTML = '<i class="fa fa-bookmark" aria-hidden="true"></i>';
					} else {
						target.innerHTML = '<i class="fa fa-bookmark-0" aria-hidden="true"></i>';
					}
				})
				.catch((e) => {
					console.error(e.response.data);
					alert(e.response.data.error);
				});
		});
	});

	//like Dislike

	const likeBtn = document.getElementById('likeBtn');
	const dislikeBtn = document.getElementById('dislikeBtn');

	likeBtn.addEventListener('click', function(e) {
		let postId = likeBtn.dataset.post;
		reqLikeDsilike('likes', postId)
			.then((res) => res.json())
			.then((data) => {
				let likeText = data.liked ? 'Liked' : 'Like';
				likeText = likeText + ` ${data.totalLikes}`;

				// let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
				let dislikeText = `Dislike  ${data.totalDislikes} `;

				likeBtn.innerHTML = likeText;
				dislikeBtn.innerHTML = dislikeText;
			})
			.catch((e) => {
				console.log(e);
				alert(e.response.data.error);
			});
	});

	dislikeBtn.addEventListener('click', function(e) {
		let postId = likeBtn.dataset.post;

		reqLikeDsilike('dislikes', postId)
			.then((res) => res.json())
			.then((data) => {
				let dislikeText = data.disliked ? 'Disliked' : 'Dislike';
				dislikeText = dislikeText + ` ${data.totalDislikes}`;

				let likeText = `Like  ${data.totalLikes} `;

				dislikeBtn.innerHTML = dislikeText;

				likeBtn.innerHTML = likeText;
			})
			.catch((e) => {
				console.log(e);
				alert(e.response.data.error);
			});
	});

	function reqLikeDsilike(type, postId) {
		let headers = new Headers();
		headers.append('Accept', 'Application/JSON');
		headers.append('Content-Type', 'Application/JSON');

		let req = new Request(`/api/${type}/${postId}`, {
			method: 'GET',
			headers,
			mode: 'cors'
		});

		return fetch(req);
	}

	// comments

	const comment = document.getElementById('comment');
	const commentHolder = document.getElementById('comment-holder');

	comment.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			if (e.target.value) {
				let postId = comment.dataset.post;
				let data = {
					body: e.target.value
				};
				let req = generateRequest(`/api/comments/${postId}`, 'POST', data);
				fetch(req)
					.then((res) => res.json())
					.then((data) => {
						let commentElement = createComment(data);
						commentHolder.insertBefore(commentElement, commentHolder.children[0]);
						e.target.value = '';
					})
					.catch((e) => {
						console.log(e.message);
						alert(e.message);
					});
			} else {
                alert('Please Enter A Valid Comment');
			}
		}
	});
	commentHolder.addEventListener('keypress', function(e) {
		if (commentHolder.hasChildNodes(e.target)) {
			if (e.key === 'Enter') {
				let commentId = e.target.dataset.comment;
				let value = e.target.value;

				if (value) {
					let data = {
						body: value
					};
					let req = generateRequest(`/api/comments/replies/${commentId}`, 'POST', data);
					fetch(req)
						.then((res) => res.json())
						.then((data) => {
							let replayElement = createReplyElement(data);
							let parent = e.target.parentElement;
							parent.previousElementSibling.append(replayElement);
							e.target.value = '';
						})
						.catch((e) => {
							console.log(e);
							alert(e.message);
						});
				} else {
					alert('Please Enter A Valid Reply');
				}
			}
		}
	});
};

function generateRequest(url, method, body) {
	let headers = new Headers();
	headers.append('Accept', 'Application/JSON');
	headers.append('Content-Type', 'Application/JSON');

	let req = new Request(url, {
		method,
		headers,
		body: JSON.stringify(body),
		mode: 'cors'
	});

	return req;
}

function createComment(comment) {
	let innerHTML = `
        <img src ="${comment.user.profilePics}" class="rounded-circle mx-3" style="width: 40px">
        <div class="media-body my-3">
            <p>${comment.body}</p>

            <div class="my-3">
                <input class="form-control" type="text" placeholder"Press Enter to Reply" name="reply" data-comment=${comment._id}>
            </div>
        </div>
    `;
	let div = document.createElement('div');
	div.className = 'media border';
	div.innerHTML = innerHTML;

	return div;
}

function createReplyElement(reply) {
	let innerHTML = `
    <img src ="${reply.profilePics}" class="rounded-circle mr-3 align-self-start" style="width: 35px">
    <div class="media-body my-3">
        <p>${reply.body}</p>
    </div>
    `;
	let div = document.createElement('div');
	div.className = 'media mt-3';

	div.innerHTML = innerHTML;

	return div;
}
