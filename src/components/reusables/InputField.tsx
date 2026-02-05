import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { Label } from './index';

type InputFieldProps = {
	label?: string;
	name: string;
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	error?: string;
	required?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
	label,
	name,
	type = 'text',
	value,
	onChange,
	placeholder,
	error,
	required = false,
}) => {
	/////////////////////////  this will be in parent component

	// const [email, setEmail] = useState('');
	// const [error, setError] = useState('');

	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setEmail(e.target.value);
	// 	setError('');
	// };

	/////////////////////////////////////

	return (
		<div className='mb-4'>
			{/* htmlFor={name} */}
			{label && <Label htmlFor={name}>
				{label} {required && <span className='text-red-400'>*</span>}
			</Label>}
			{/* <div className='relative'> */}
			<input
				id={name}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				className={`font-primary input_field w-full px-4 py-2 border focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button transition ${
					error ? 'border-red-400' : 'border-borderBg'
				}`}
			/>
			{/* <IoSearchOutline className='absolute top-[50%] -translate-y-[50%] right-4 text-borderBg text-2xl' /> */}
			{/* </div> */}
			{error && <p className='text-sm text-red-400 mt-1'>{error}</p>}
		</div>
	);
};

export default InputField;
