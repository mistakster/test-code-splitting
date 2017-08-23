import React from 'react';
import {render} from 'react-dom';

export default node => {
	render(
		React.createElement('div'),
		node
	);
};
