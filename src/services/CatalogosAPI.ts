
const fetchClientesUrl = 'http://127.0.0.1:8000/api/catalogos/getClientes';
const fetchProductosUrl = 'http://127.0.0.1:8000/api/catalogos/getProductos';
const fetchTipoFacturacionUrl = 'http://127.0.0.1:8000/api/catalogos/getTipoFacturacion';

export const fetchClientes = (callback: Function) => {
    fetch(`${fetchClientesUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
        .then((response) => {
            return response.json()
        })
        .then((response) =>{
            callback(response)
        })
}

export const fetchProductos = (callback: Function) => {
    fetch(`${fetchProductosUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
        .then((response) => {
            return response.json()
        })
        .then((response) =>{
            callback(response)
        })
}

export const fetchTipoFacturacion = (callback: Function) => {
    fetch(`${fetchTipoFacturacionUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
        .then((response) => {
            return response.json()
        })
        .then((response) =>{
            callback(response)
        })
}