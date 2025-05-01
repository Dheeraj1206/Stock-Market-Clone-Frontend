import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		phone: '',
	});
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		phone: '',
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const validateForm = () => {
		let formErrors = { name: '', email: '', password: '', phone: '' };
		let isValid = true;


		if (!form.name) {
			formErrors.name = 'Name is required';
			isValid = false;
		}


		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		if (!form.email) {
			formErrors.email = 'Email is required';
			isValid = false;
		} else if (!emailRegex.test(form.email)) {
			formErrors.email = 'Enter a valid email';
			isValid = false;
		}


		if (!form.password) {
			formErrors.password = 'Password is required';
			isValid = false;
		} else if (form.password.length < 6) {
			formErrors.password = 'Password must be at least 6 characters';
			isValid = false;
		}


		if (!form.phone) {
			formErrors.phone = 'Phone number is required';
			isValid = false;
		} else if (form.phone.length < 10) {
			formErrors.phone = 'Phone number must be at least 10 digits';
			isValid = false;
		}

		setErrors(formErrors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();


		if (!validateForm()) {
			return;
		}

		const res = await fetch('http://localhost:5000/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});

		const data = await res.json();

		if (res.ok) {
			alert('Registration successful!');
			setErrors({ name: '', email: '', password: '', phone: '' });
		} else {

			const errorMap = {};
			data.errors?.forEach((error) => {
				errorMap[error.param] = error.msg;
			});
			setErrors(errorMap);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name
					</label>
					<input
						name="name"
						placeholder="John Doe"
						onChange={handleChange}
						value={form.name}
						required
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">{errors.name}</p>
					)}
				</div>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						name="email"
						placeholder="you@example.com"
						type="email"
						onChange={handleChange}
						value={form.email}
						required
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">{errors.email}</p>
					)}
				</div>

				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						name="password"
						type="password"
						placeholder="••••••••"
						onChange={handleChange}
						value={form.password}
						required
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">{errors.password}</p>
					)}
				</div>

				<div className="mb-6">
					<label
						htmlFor="phone"
						className="block text-sm font-medium text-gray-700"
					>
						Phone
					</label>
					<input
						name="phone"
						placeholder="+1234567890"
						onChange={handleChange}
						value={form.phone}
						required
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.phone && (
						<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
				>
					Register
				</button>

				<div className="mt-6 text-center">
					<span className="text-sm text-gray-600">
						Already have an account?
					</span>
					<button
						type="button"
						className="ml-2 text-sm text-blue-600 hover:underline"
						onClick={() => navigate('/login')}
					>
						Login
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
