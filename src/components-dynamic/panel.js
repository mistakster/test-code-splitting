export default () => {
	const node = document.querySelector('.my-panel');

	if (node) {
		import('./panel-container')
			.then(container => {
				container(node);
			});
	}
};
