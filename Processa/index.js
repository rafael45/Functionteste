module.exports = async function (context, req) {
    const nome = req.query.nome || "amigo";

    context.res = {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            message: `Olá, ${nome}, Deus te abençoe.`
        }
    };
};
