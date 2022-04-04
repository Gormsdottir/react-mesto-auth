import { useState } from 'react';


function Login({onSubmit}) {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitLogin(evt) {
        evt.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <section className="login">
            <h1 className="login__title">Вход</h1>
            <form className="login__form" onSubmit={handleSubmitLogin}>
                <input
                    name='email'
                    id='email'
                    type='email'
                    placeholder='Email'
                    className="login__input login__input_type_email"
                    required
                    onChange={handleChangeEmail}
                    value={email}
                />
                <input
                    name='password'
                    id='password'
                    type='password'
                    placeholder='Пароль'
                    className='login__input login__input_type_password'
                    required
                    onChange={handleChangePassword}
                    value={password}
                />
            </form>
            <button
                className="button button_type_login"
                type="submit"
            >
                Войти
            </button>
        </section>
    );
}

export default Login;