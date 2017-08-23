import $ from 'jquery';
import React from 'react';
import {render} from 'react-dom';
import SearchResults from './search-results';

export default node => {
	return $.ajax({
		url: '/api/search',
		success: data => {
			render(
				React.createElement(SearchResults, {data}),
				node
			);
		}
	});
};
