import React from 'react';
import { Label } from './index';

type Option = {
	name: string;
	_id: string;
};

type SelectBoxProps = {
	label?: string;
	name: string;
	value: string;
	onChange: any;
	// onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: Option[];
	placeholder?: string;
	error?: string;
	required?: boolean;
};

const SelectBox: React.FC<SelectBoxProps> = ({
	label,
	name,
	value,
	onChange,
	options,
	placeholder = 'Select an option',
	error,
	required = false,
}) => {
	return (
		<div className='mb-4 w-full lg:w-auto lg:flex-[1_1_auto]'>
			<Label htmlFor={name}>
				{label} {required && <span className='text-red-400'>*</span>}
			</Label>
			<select
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className={`w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-button appearance-none text-[14px] transition ${
					error ? 'border-red-400' : 'border-gray-300'
				}`}
			>
				<option value='' disabled>
					{placeholder}
				</option>
				{options.map((opt: any) => (
					<option key={opt?._id} value={opt?._id}>
						{opt?.name}
					</option>
				))}
			</select>
			{error && <p className='text-sm text-red-400 mt-1'>{error}</p>}
		</div>
	);
};

export default SelectBox;
