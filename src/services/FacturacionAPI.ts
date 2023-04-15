const saveFormulaUrl = 'http://127.0.0.1:8000/api/facturacion/save';
const fetchFormulasUrl = 'http://127.0.0.1:8000/api/facturacion/getInfo';
const deleteFormulaUrl = 'http://127.0.0.1:8000/api/facturacion/';

export const guardarFormula = (data: any, callback: Function) => {
    fetch(`${saveFormulaUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    })
        .then((response) => {

            if (response.ok) {
                callback(true)
            }
            return response.json();
        })
}

export const fetchFormulas = (callback: Function) => {
    fetch(`${fetchFormulasUrl}`, {
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

export const deleteFormula = (id: string | number) => {
    fetch(`${deleteFormulaUrl}${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
        .then((response) => {
            return response.json()
        })
}