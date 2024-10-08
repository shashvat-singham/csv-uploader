import React from 'react';

import { BASE_URL, STEPS } from './Constants';

import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function DownloadTemplate() {
	const step1 = STEPS[0];

	const getFile = () => {
    axios({
      url: `${BASE_URL}/download`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
       // hack solution without using external libraries
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', 'artesiansoft.csv');
       document.body.appendChild(link);
       link.click();
    });
	};

	return (
		<Row>
			<Col>
				<div className='ordered-list-icon'>1</div>&emsp;{step1}&emsp;
				<Button color='primary' onClick={getFile}>
					Download (csv)&nbsp;&nbsp;
					<FontAwesomeIcon icon={faDownload} />
				</Button>
			</Col>
		</Row>
	);
}

export default DownloadTemplate;
