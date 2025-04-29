import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationIcon from '../assets/Icons/notification_light.svg';
import walletIcon from '../assets/Icons/wallet_light.svg';
import shoppingCartIcon from '../assets/Icons/shopping-cart_light.svg';
import defaultAvatarIcon from '../assets/Icons/default-avatar-light.svg';
import searchIcon from '../assets/Icons/search_icon.svg';
import growwLogo from '../assets/Icons/groww-logo-light.svg';

const Navbar = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();

	const handleInputChange = (e) => setSearchQuery(e.target.value);

	const handleSearch = (e) => {
		if (e.key === 'Enter') {
			navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<nav className="flex justify-between items-center px-4 sm:px-8 h-[5rem] max-w-[80rem] w-full mx-auto bg-white text-black">
			{/* Left Section: Logo + Links */}
			<div class="flex items-center space-x-[48px] sm:space-x-4 justify-start">
				<a href="/" data-discover="true">
					<img
						alt="Groww Logo"
						class="h-[50px] w-[150px]"
						src="/src/assets/Icons/groww-logo-light.svg"
					/>
				</a>
				<div class="flex space-x-4">
					<a
						class="text-lg font-medium hover:text-blue-600 transition-colors"
						href="/"
						data-discover="true"
					>
						Explore
					</a>
					<a
						class="text-lg font-medium hover:text-blue-600 transition-colors"
						href="/investment"
						data-discover="true"
					>
						Dashboard
					</a>
				</div>
			</div>

			{/* Middle Section: Search */}
			<div className="relative flex items-center w-full sm:w-[464px] h-[44px] sm:h-[44px] justify-center">
				<input
					type="text"
					placeholder="Search Groww..."
					aria-label="Search"
					value={searchQuery}
					onChange={handleInputChange}
					onKeyDown={handleSearch}
					className="w-full sm:w-[464px] h-full pl-[2.5rem] py-[0.25rem] text-sm border-[0.05rem] border-gray-300 bg-white text-black rounded-md placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<img
					src={searchIcon}
					alt=""
					aria-hidden="true"
					className="absolute left-3 w-[0.9375rem] h-[0.9375rem]"
				/>
			</div>

			{/* Right Section: Icons + Avatar */}
			<div className="flex items-center space-x-4">
				<div className="flex items-center justify-between w-[9.5rem] h-[2.5rem]">
					<button
						aria-label="Notifications"
						className="w-6 h-6 flex justify-center items-center hover:scale-110 transition-transform"
					>
						<img
							src={notificationIcon}
							alt="Notifications"
							className="w-6 h-6"
						/>
					</button>
					<button
						aria-label="Wallet"
						className="w-6 h-6 flex justify-center items-center hover:scale-110 transition-transform"
					>
						<img src={walletIcon} alt="Wallet" className="w-6 h-6" />
					</button>
					<button
						aria-label="Shopping Cart"
						className="w-6 h-6 flex justify-center items-center hover:scale-110 transition-transform"
					>
						<img
							src={shoppingCartIcon}
							alt="Shopping Cart"
							className="w-6 h-6"
						/>
					</button>
				</div>
				<img
					className="w-10 h-10 rounded-full"
					src={defaultAvatarIcon}
					alt="User Avatar"
				/>
			</div>
		</nav>
	);
};

export default Navbar;
