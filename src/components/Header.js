import { useContext } from 'react';
import logo from '../images/logo.svg';
import { Link, Route } from 'react-router-dom';


function Header({email, onSignOut}) {
    

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип Место" />
      <Route path="/sign-up">
        <Link className="authpage_link" to='/sign-in'>Войти</Link>
      </Route>
      <Route path="/sign-in">
        <Link className="authpage_link" to='/sign-up'>Регистрация</Link>
      </Route>
      <Route exact path="/">
        <div className='header__info'>
          <p className="header__email"> {email} </p>
          <Link className="authpage_link" to='/sign-in' onClick={handleSignOut}> Выйти </Link>
        </div>
      </Route>
    </header>
  );
};

export default Header;
