const BancoCentralAPI = require('./bc-api.js');

(async () => {
    const bcAPI = new BancoCentralAPI();
    // Teste com moeda e data válidas
    // const resultado = await bcAPI.getCotacaoMoedaDia('USD', '09-15-2025');
    // console.log('Moeda USD em 15-09-2025:', resultado);

    const resultGBP = await bcAPI.getCotacaoMoedaDia('GBP', '09-12-2025');
    console.log('Moeda GBP em 12-09-2025:', resultGBP);

    const resultGBPPTAX = await bcAPI.getCotacaoMoedaDiaPTAX('GBP', '09-12-2025');
    console.log('Moeda GBP PTAX em 12-09-2025:', resultGBPPTAX);

    // // Teste cotação de hoje
    // const resultadoHoje = await bcAPI.getCotacaoMoedaHoje('USD');
    // console.log('Cotação USD hoje:', resultadoHoje);

    // // Teste múltiplas moedas
    // const resultadoMultiplas = await bcAPI.getCotacaoMultiplasMoedas(['USD', 'EUR'], '09-15-2025');
    // console.log('Cotações USD e EUR em 15-09-2025:', resultadoMultiplas);
})();