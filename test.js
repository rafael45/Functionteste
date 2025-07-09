/* Faz o require da função */
const tree = require('./index');

/* Faz a listagem desse diretório */
const data = tree.View.init('./');

/* Retorna SOMENTE os resultados */
console.log(data.results.value);

const tree = require('./index.js');
console.log(Object.keys(tree));
