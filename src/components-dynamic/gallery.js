export default () => {
	import('jquery')
		.then($ => {
			$('.my-gallery').each((index, element) => {
				const $element = $(element);

				$element.addClass('initialized');
			});
		});
};
