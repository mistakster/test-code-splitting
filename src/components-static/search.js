import container from './search-container';

export default () => {
	const node = document.querySelector('.my-search');

	if (node) {
		container(node);
	}
};
