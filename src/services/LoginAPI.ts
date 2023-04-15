
const validLoginUrl = 'http://127.0.0.1:8000/api/login';
const validLogoutUrl = 'http://127.0.0.1:8000/api/logout';
const userProfileUrl = 'http://127.0.0.1:8000/api/user-profile';


export const validLogin = (data: any, callback: Function) => {
    fetch(`${validLoginUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            callback(response)
        })
}

export const fetchUserProfile = (callback: Function) => {
    fetch(`${userProfileUrl}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Accept': 'application/json',
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            callback(response)
        })
}

export const fetchLogout = () => {
    fetch(`${validLoginUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
        .then((response) => {
            return response.json()
        })
}