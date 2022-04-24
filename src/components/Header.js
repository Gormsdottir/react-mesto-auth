import { useState } from "react";
import logo from "../images/logo.svg";

import { NavLink, useLocation } from 'react-router-dom';

function Header({ loggedIn, email, onSignOut }) {

  const location = useLocation();
  const [navBarIsOpen, setNavBarIsOpen] = useState(false);


  function handleToggleMenu() {
    setNavBarIsOpen(!navBarIsOpen);
  }

  function handleSignOut() {
    setNavBarIsOpen(false);
    onSignOut();
  }

  return (
    <header className='header'>
      {loggedIn &&
        (
          <div
            className={navBarIsOpen ? 'header__email-container header__email-container_opened' : 'header__email-container'}
          >
            <address
              className="header__email"
            >
              {email && email}
            </address>
            <button
              className="header__logout"
              type="button"
              onClick={handleSignOut}
            >
              Выйти
            </button>
          </div>
        )
      }
      <img className="header__logo" src={logo} alt="логотип Место" />
      <div
        className="header__container"
      >
        {!loggedIn &&
          (<nav>
            {location.pathname === '/sign-in' &&
              (
                <NavLink
                  className="header__link"
                  to="/sign-up"
                >
                  Войти
                </NavLink>
              )
            }
            {location.pathname === '/sign-up' &&
              (
                <NavLink
                  className="header__link"
                  to="/sign-in"
                >
                  Регистрация
                </NavLink>
              )
            }
          </nav>
          )
        }
      </div>

    </header>
  )
}

export default Header;