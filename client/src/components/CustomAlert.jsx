import React, { useState } from 'react';
import { Alert } from 'reactstrap';

const CustomAlert = (props) => {
	const [visible, setVisible] = useState(props.visible);
	const onDismiss = () => setVisible(false);

	return (
		<Alert color={props.color} isOpen={visible} toggle={onDismiss}>
			{props.text}
		</Alert>
	);
};

export default CustomAlert;
