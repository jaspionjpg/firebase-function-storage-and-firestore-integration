const loaderService  = require('./services/loader-service')

const asdf = loaderService.readFile('./transacoes nao conciliadas.txt')

asdf.then((valor) => {
    console.log("valor foi: " + valor)
})