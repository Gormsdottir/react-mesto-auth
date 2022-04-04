import React from 'react';
import logo from '../images/logo.svg';
import { Route, Link } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext';

function Header({ onSignOut }) {

	const {email} = React.useContext(CurrentUserContext);

	return (
		<header className="header">
			<img className="header__logo" src={logo} alt="логотип Место" />
			<Route path="/sign-up">
				<Link className="register__link" to="/sign-in">Войти</Link>
			</Route>
			<Route path="/sign-in">
				<Link className="register__link" to='/sign-up'>Регистрация</Link>
			</Route>
			<Route exact path="/">
				<div className="header__menu">
					<p className="header__info">{email}</p>
						<Link className="register__link" to='/sign-in' onClick={onSignOut}>Выйти</Link>
				</div>
			</Route>
		</header>
	);
}

export default Header;