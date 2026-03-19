const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

app.get('/carros', (req, res) => {
    res.status(200).send({
       carros
    })
})

app.post('/carros/:id', (req, res)=>{
    const {id} = req.params
    const {modelo, marca, cor, placa} = req.body

    if(!modelo || !marca || !cor || !placa){
        res.status(418).send('Todos os campos são obrigatórios')
    }
    res.send({
        id,
        modelo,
        marca,
        cor,
        placa
    })
    carros.push({
        id,
        modelo,
        marca,
        cor,
        placa
    })
})


let carros = [
    {
        id: 1,
        modelo: 'Corsa',
        marca: 'Chevrolet',
        cor: 'Prata',
        placa: 'ABC-1234'
    }
]
