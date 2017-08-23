import React from 'react';
import moment from 'moment';

function formatDate(date) {
	return moment(date).format('dddd, MMMM Do YYYY');
}

export default SearchResults = ({data}) => (
	<div>
		{data.list.map((item, key) => (
			<div key={key}>
				<div>{item.title}</div>
				<div>{formatDate(item.date)}</div>
			</div>
		))}
	</div>
);
