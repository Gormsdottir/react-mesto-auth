import Header from './Header';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddCardPopup from './AddCardPopup';
import ImagePopup from './ImagePopup';
import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { api } from '../utils/api';
import { BrowserRouter, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';
import successful from '../images/successful.svg';
import unsuccessful from '../images/unsuccessful.svg';


function App() {

  // хуки
  //открытие попапа редактирование профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  //открытие попапа добавления карточки
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  //открытие попапа обновления аватара
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  //открытие попапа с картинкой
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  //текущий пользователь
  const [currentUser, setCurrentUser] = useState({});
  //карточки
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isToolTipPopupOpen, setIsToolTipPopupOpen] = useState(false);
  const [toolTipMessage, setToolTipMessage] = useState({});

  const history = useHistory();

  //получение инфо при загрузке и отрисовка карточек

  useEffect(() => {
    tokenCheck();
    if (isLoggedIn)
      api.getAllData()
        .then(([cards, userInfo]) => {
          setCurrentUser({ ...currentUser, userInfo });
          setCards(cards);
        })
        .catch((err) => `Не удалось получить карточки с сервера : ${err}`);
  }, [isLoggedIn]);

  //функции 
  //открытие попапа редактирование профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  //открытие попапа добавления карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  //открытие попапа обновления аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  //открытие попапа с картинкой
  function handleCardClick(data) {
    setSelectedCard(data);
  }
  //закрытие всех попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsToolTipPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
  }
  //обновление инфо в профиле пользователя
  function handleUpdateUser(userInfo) {
    api.setUserInfoApi(userInfo).then((userInfo) => {
      setCurrentUser(userInfo);
    })
      .catch((err) => console.log(err));
    closeAllPopups();
  }
  //обновление аватара
  function handleUpdateAvatar(userInfo) {
    api.handleUserAvatar(userInfo).then((userInfo) => {
      setCurrentUser(userInfo);
    })
      .catch((err) => console.log(err));
    closeAllPopups();
  }
  //добавление новой карточки
  function handleAddPlaceSubmit(newCard) {
    api.addUserCard(newCard).then((newCard) => {
      setCards([newCard, ...cards]);
    })
      .catch((err) => console.log(err));
    closeAllPopups();
  }
  //лайк карточки
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => console.log(err));
  }
  //удаление карточки
  function handleCardDelete(removedCard) {
    api.delete(removedCard._id).then(() => {
      setCards((cards) => cards.filter((c) => {
        return c._id !== removedCard._id;
      }));
    })
      .catch((err) => console.log(err));
  }

  function handleSubmitRegister(data) {
    auth.registration(data)
      .then(({ email }) => {
        setCurrentUser({ ...currentUser, email })
        history.push("/sign-in")
        setIsToolTipPopupOpen(true)
        setToolTipMessage({
          message: 'Вы успешно зарегистрировались!',
          img: successful
        })
      })
      .catch((err) => {
        console.log(err);
        setIsToolTipPopupOpen(true);
        setToolTipMessage({
          message: 'Что-то пошло не так! Попробуйте ещё раз.',
          img: unsuccessful
        })
        if (err.status === 400) {
          console.log('400 - некорректно заполнено одно из полей');
        }
      })
      .finally(() => {
        setIsToolTipPopupOpen(true);
      })
  }

  function handleSubmitLogin(data) {
    auth.authorization(data)
      .then(({ token }) => {
        localStorage.setItem('jwt', token)
        setIsLoggedIn(true)
        history.push('/')
      })
      .catch((err) => {
        console.log(err);
        setIsToolTipPopupOpen(true);
        setToolTipMessage({ message: 'Что-то пошло не так! Попробуйте ещё раз.', img: unsuccessful })
        if (err.status === 400) {
          console.log('400 - не передано одно из полей');
        } else if (err.status === 401) {
          console.log('401 - пользователь с email не найден');
        }
      })
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getUser(jwt)
        .then(({ data: { email } }) => {
          setCurrentUser({ ...currentUser, email })
          setIsLoggedIn(true)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/sign-in');

  }


  return (
    <BrowserRouter>
      <div className="page">
        <div className="root">
          <CurrentUserContext.Provider value={currentUser}>
            <Header
              signOut={signOut}
            />
            <Switch>
              <ProtectedRoute exact path="/"
                isLoggedIn={isLoggedIn}
                component={Main}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />

              <Route path='/sign-in'>
                {isLoggedIn ? <Redirect to="/" /> : <Login
                  onSubmit={handleSubmitLogin}
                />}
              </Route>

              <Route path='/sign-up'>
                {isLoggedIn ? <Redirect to="/" /> : <Register
                  onSubmit={handleSubmitRegister}
                />}
              </Route>
            </Switch>

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <AddCardPopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
            />

            <InfoTooltip
              name="infotooltip"
              isOpen={isToolTipPopupOpen}
              toolTipMessage={toolTipMessage}
              onClose={closeAllPopups}
            />
          </CurrentUserContext.Provider>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;