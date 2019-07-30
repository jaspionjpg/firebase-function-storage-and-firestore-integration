const loaderService  = require('./services/loader-service')

const asdf = loaderService.readFile('./transacoes_nao_conciliadas.txt')

asdf.then((valor) => {
    console.log(valor);
})