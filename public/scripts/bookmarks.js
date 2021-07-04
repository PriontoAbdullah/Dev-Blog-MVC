window.onload = function() {
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
				.then((res) => res.json())
				.then((data) => {
					if (data.bookmark) {
						target.innerHTML = '<i class="fa fa-bookmark" aria-hidden="true"></i>';
					} else {
						target.innerHTML = '<i class="fa fa-bookmark-o" aria-hidden="true"></i>';
					}
				})
				.catch((e) => {
					console.error(e.response.data);
					alert(e.response.data.error);
				});
		});
	});
};
