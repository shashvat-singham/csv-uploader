import React, { useState } from 'react';
import {
	Dropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu,
} from 'reactstrap';

const CustomDropdown = (props) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const toggle = () => setDropdownOpen((prevState) => !prevState);

	return (
		<Dropdown isOpen={dropdownOpen} toggle={toggle}>
			<DropdownToggle caret>{props.value}</DropdownToggle>
			<DropdownMenu>
				{props.options.map((option) => (
					<DropdownItem id={props.id} value={option} onClick={props.onChange}>
						{option}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};

export default CustomDropdown;
