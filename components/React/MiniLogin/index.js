import { IntlProvider, useIntl } from 'react-intl';
import { Provider, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { hideLogin, toggleLogin } from '@js/redux/modules/visibility';
import messages, { locale } from '../intl';
import { useCustomer, useLogin, useLogout } from '@js/api';

import Error from '../Error';
import { ReactComponent as IconCLose } from './imgs/icon-close.svg';
import Input from '../Input';
import Loader from '../Loader';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@js/api';
import { render } from 'react-dom';
import store from '@js/redux/store';

function AccountLink({ customer }) {
	const { mutate: logout } = useLogout();
	const intl = useIntl();

	return (
		<div className="px-10">
			<button
				type="button"
				className="absolute right-0 hover:text-gray-600 focus:text-gray-600 top-header"
				data-close-login
			>
				<IconCLose className="" />
			</button>
			<legend className="mb-4 text-2xl leading-5 uppercase font-heading text-bold">
				{intl.formatMessage({ id: 'HELLO' })} {customer.firstName}{' '}
				{customer.lastName}
			</legend>
			<nav className="flex flex-col mt-10">
				<a
					href="/account-update"
					className="flex items-center justify-between pb-5 text-base italic leading-10 font-heading"
				>
					{intl.formatMessage({ id: 'ACCOUNT' })}
					<svg
						className="arrow"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
					>
						<path
							fill="currentColor"
							d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
						/>
					</svg>
				</a>
				<a
					href="/account-address"
					className="flex items-center justify-between py-5 text-base italic leading-10 border-t border-b border-gray-400 font-heading"
				>
					{intl.formatMessage({ id: 'MY_ADDRESSES' })}
					<svg
						className="arrow"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
					>
						<path
							fill="currentColor"
							d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
						/>
					</svg>
				</a>
				<a
					href="/account-orders"
					className="flex items-center justify-between pt-5 text-base italic leading-10 font-heading"
				>
					{intl.formatMessage({ id: 'MY_ORDERS' })}
					<svg
						className="arrow"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
					>
						<path
							fill="currentColor"
							d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
						/>
					</svg>
				</a>
			</nav>
			<div className="mt-15.5">
				<a
					href="/logout"
					className="btn"
					onClick={(e) => {
						e.preventDefault();
						logout();
					}}
				>
					{intl.formatMessage({ id: 'DECONNECTION' })}
				</a>
			</div>
		</div>
	);
}

function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { mutate: login, isLoading, error } = useLogin();
	const intl = useIntl();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await login({ email, password });
			}}
		>
			<legend className="mb-4 text-2xl uppercase">
				{intl.formatMessage({ id: 'ALREADY_CUSTOMER' })}
			</legend>
			<div className="grid grid-cols-1 gap-6 mb-8">
				<Input
					type="email"
					name="email"
					className=""
					label="E-mail"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Input
					type="password"
					name="password"
					className=""
					label="Mot de passe"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			{error ? (
				<Error error={error.response?.data?.description || 'Erreur'} />
			) : null}
			<div className="flex items-center justify-between mt-4">
				<button
					type="submit"
					className="btn btn--sm"
					disabled={isLoading || !password || !email}
				>
					{isLoading
						? intl.formatMessage({ id: 'LOADING' })
						: intl.formatMessage({ id: 'LOGIN' })}
				</button>

				<a
					href="/password"
					disabled={isLoading}
					className="text-sm italic hover:-dark"
				>
					{intl.formatMessage({ id: 'FORGET_PASSWORD' })}{' '}
				</a>
			</div>
		</form>
	);
}

function IsLoggedOut() {
	const intl = useIntl();

	return (
		<div>
			<div className="py-10 border-b border-opacity-25 border-main">
				<LoginForm />
			</div>
			<div className="py-10">
				<fieldset className="">
					<legend className="mb-4 text-2xl uppercase">
						{intl.formatMessage({ id: 'NEW_CUSTOMER' })}
					</legend>
					<a href="/register" className="mb-20 btn btn--sm">
						{intl.formatMessage({ id: 'CREATE_ACCOUNT' })}
					</a>
				</fieldset>
			</div>
		</div>
	);
}

export function MiniLogin() {
	const visible = useSelector((state) => state.visibility.login);
	const cartVisible = useSelector((state) => state.visibility.cart);
	const { data: customer, isLoading } = useCustomer();

	useEffect(() => {
		if (visible && cartVisible && customer) {
			//Turbolinks.visit('/order/delivery');
			window.location = `${window.location.origin}/order/delivery`;
		}
	}, [visible, cartVisible, customer]);

	return (
		<div className={`MiniLogin ${visible ? 'MiniLogin--visible' : ''}`}>
			{isLoading ? (
				<Loader className="mt-20" />
			) : !customer ? (
				<IsLoggedOut />
			) : (
				<AccountLink customer={customer} />
			)}
		</div>
	);
}

export default function MiniLoginRender() {
	document.addEventListener(
		'click',
		(e) => {
			if (e.target?.matches('[data-toggle-login]')) {
				e.preventDefault();
				store.dispatch(toggleLogin());
			} else if (e.target?.matches('[data-close-login]')) {
				e.preventDefault();
				store.dispatch(hideLogin());
			}
		},
		false
	);

	render(
		<QueryClientProvider client={queryClient}>
			<IntlProvider locale={locale} messages={messages[locale]}>
				<Provider store={store}>
					<MiniLogin />
				</Provider>
			</IntlProvider>
		</QueryClientProvider>,
		document.querySelector('.MiniLogin-root')
	);
}
