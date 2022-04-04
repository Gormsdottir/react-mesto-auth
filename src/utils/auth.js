export const BASE_URL = 'https://auth.nomoreparties.co';

const checkResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
        return data;
    }
    const { statusCode } = data;
    const { message } = data.message[0].messages[0]
    const error = new Error(message || 'Ошибка');
    error.status = statusCode;
    throw error
}

export const registration = (email, password) => {
    return fetch(`${BASE_URL}/sign-up`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(checkResponse)
};

export const authorization = (email, password) => {
    return fetch(`${BASE_URL}/sign-in`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(checkResponse)
};

export const getUser = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(checkResponse)
}