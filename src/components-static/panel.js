import container from './panel-container';

export default () => {
	const node = document.querySelector('.my-panel');

	if (node) {
		container(node);
	}
};
