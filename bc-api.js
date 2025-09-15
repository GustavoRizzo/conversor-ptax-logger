// bc-api.js - Cliente API para cotação de moedas do Banco Central do Brasil
class BancoCentralAPI {
    constructor() {
        this.baseURL = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata";
    }

    /**
     * Obtém a cotação de uma moeda em uma data específica
     * @param {string} codigoMoeda - Código da moeda (ex: 'USD', 'EUR', 'GBP')
     * @param {string} dataCotacao - Data no formato 'MM-DD-YYYY' (ex: '03-18-2023')
     * @returns {Promise<Object>} - Dados da cotação
     */
    async getCotacaoMoedaDia(codigoMoeda, dataCotacao) {
        try {
            // Validar parâmetros
            if (!codigoMoeda || !dataCotacao) {
                throw new Error('Código da moeda e data são obrigatórios');
            }

            // Validar formato da data (MM-DD-YYYY)
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(dataCotacao)) {
                throw new Error('Formato de data inválido. Use MM-DD-YYYY');
            }

            // Construir a URL
            const url = `${this.baseURL}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${codigoMoeda}'&@dataCotacao='${dataCotacao}'&$top=100&$format=json`;

            // Fazer a requisição
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Verificar se existem resultados
            if (data.value && data.value.length > 0) {
                return {
                    success: true,
                    data: data.value,
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    success: false,
                    message: 'Nenhuma cotação encontrada para a data e moeda informadas',
                    data: []
                };
            }
        } catch (error) {
            console.error('Erro ao obter cotação:', error);
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
    }

    /**
     * Obtém a cotação de uma moeda na data atual
     * @param {string} codigoMoeda - Código da moeda (ex: 'USD', 'EUR', 'GBP')
     * @returns {Promise<Object>} - Dados da cotação
     */
    async getCotacaoMoedaHoje(codigoMoeda) {
        const hoje = new Date();
        const dataFormatada = `${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}-${hoje.getFullYear()}`;
        return this.getCotacaoMoedaDia(codigoMoeda, dataFormatada);
    }

    /**
     * Obtém a cotação de várias moedas em uma data específica
     * @param {Array<string>} codigosMoedas - Array com os códigos das moedas (ex: ['USD', 'EUR', 'GBP'])
     * @param {string} dataCotacao - Data no formato 'MM-DD-YYYY' (ex: '03-18-2023')
     * @returns {Promise<Object>} - Dados das cotações
     */
    async getCotacaoMultiplasMoedas(codigosMoedas, dataCotacao) {
        try {
            const resultados = {};

            for (const moeda of codigosMoedas) {
                resultados[moeda] = await this.getCotacaoMoedaDia(moeda, dataCotacao);
                // Pequeno delay para não sobrecarregar a API
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            return {
                success: true,
                data: resultados,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erro ao obter cotações múltiplas:', error);
            return {
                success: false,
                message: error.message,
                data: {}
            };
        }
    }

    /**
     * Obtém a cotação PTAX de fechamento de uma moeda em uma data específica
     * @param {string} codigoMoeda - Código da moeda (ex: 'USD', 'EUR', 'GBP')
     * @param {string} dataCotacao - Data no formato 'MM-DD-YYYY' (ex: '03-18-2023')
     * @returns {Promise<Object>} - Dados da cotação PTAX de fechamento
     */
    async getCotacaoMoedaDiaPTAX(codigoMoeda, dataCotacao) {
        try {
            // Primeiro obtemos todas as cotações do dia
            const resultado = await this.getCotacaoMoedaDia(codigoMoeda, dataCotacao);

            if (!resultado.success) {
                // Se não houve sucesso, retornamos o resultado original
                return resultado;
            }

            // Filtramos para encontrar o registro de Fechamento PTAX
            const fechamentoPTAX = resultado.data.find(item =>
                item.tipoBoletim === 'Fechamento PTAX'
            );

            if (fechamentoPTAX) {
                return {
                    success: true,
                    data: fechamentoPTAX,
                    timestamp: resultado.timestamp,
                    message: 'Cotação PTAX de fechamento encontrada'
                };
            } else {
                // Se não encontrou Fechamento PTAX, retorna o último registro disponível
                const ultimaCotacao = resultado.data[resultado.data.length - 1];

                return {
                    success: true,
                    data: ultimaCotacao,
                    timestamp: resultado.timestamp,
                    message: 'Fechamento PTAX não encontrado, retornando última cotação disponível'
                };
            }
        } catch (error) {
            console.error('Erro ao obter cotação PTAX:', error);
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
}

// Exemplo de uso:
// const bcAPI = new BancoCentralAPI();
// bcAPI.getCotacaoMoedaDia('USD', '03-18-2023').then(console.log);

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BancoCentralAPI;
}

// Torna a classe acessível globalmente no navegador
if (typeof window !== 'undefined') {
    window.BancoCentralAPI = BancoCentralAPI;
}