module.exports = async function (context, req) {
    const func = require('../index.js');
    const result = func.SeuNomeDeExportacao.SuaFuncaoDesejada(); // ajuste para chamar a função correta

    context.res = {
        status: 200,
        body: result,
    };
};
