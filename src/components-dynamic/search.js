export default () => {
	const node = document.querySelector('.my-search');

	if (node) {
		import('./search-container')
			.then(container => {
				container(node);
			});
	}
};
