import $ from 'jquery';

export default () => {
	$('.my-gallery').each((index, element) => {
		const $element = $(element);

		$element.addClass('initialized');
	});
};
