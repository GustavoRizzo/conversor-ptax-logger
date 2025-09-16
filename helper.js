
let logTemplate = null;

// Carregar template externo (só uma vez)
fetch("log-template.html")
    .then(res => res.text())
    .then(html => {
        const container = document.createElement("div");
        container.innerHTML = html.trim();
        logTemplate = container.querySelector("#log-template");
    });
fetch("log-conversao-template.html")
    .then(res => res.text())
    .then(html => {
        const container = document.createElement("div");
        container.innerHTML = html.trim();
        logConversaoTemplate = container.querySelector("#log-conversao-template");
    });


// Função para adicionar um log
function addLog(value) {
    if (!logTemplate) {
        console.error("Template ainda não carregado");
        return;
    }

    if (logList.querySelector('.empty-logs')) {
        logList.innerHTML = '';
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString();

    // Clonar template
    const li = logTemplate.content.firstElementChild.cloneNode(true);
    li.querySelector('.log-value').textContent = value;
    li.querySelector('.log-time').textContent = timeString;
    li.style.backgroundColor = getRandomTranslucentColor();

    li.querySelector('.delete-log').addEventListener('click', function () {
        li.remove();
        if (logList.children.length === 0) {
            logList.innerHTML = '<li class="empty-logs">Nenhum registro ainda. Digite algo no campo acima.</li>';
        }
        saveLogsToStorage();
    });

    logList.prepend(li);
    saveLogsToStorage();
}


// Função para adicionar um log de conversão de moeda
function addLogConversao(conversao) {
    console.log("Adicionando log de conversão:", conversao);
    if (!logConversaoTemplate) {
        console.error("Template ainda não carregado");
        return;
    }

    if (logList.querySelector('.empty-logs')) {
        logList.innerHTML = '';
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString();

    // Clonar template
    const li = logConversaoTemplate.content.firstElementChild.cloneNode(true);
    // Mapeamento dos campos para as propriedades do objeto conversao
    const dataToFill = {
        moeda: conversao.moeda,
        dataCotacao: conversao.dataCotacao.split(' ')[0],
        contacaoRealMoeda: conversao.contacaoRealMoeda,
        contacaoRealMoedaInversa: conversao.contacaoRealMoedaInversa.toFixed(6),
        contacaoMoedaReal: conversao.contacaoMoedaReal,
        contacaoMoedaRealInversa: conversao.contacaoMoedaRealInversa.toFixed(6),
        timeString: timeString
    };
    // Usa querySelectorAll para encontrar TODOS os elementos com o atributo 'data-field'
    const elementsToFill = li.querySelectorAll('[data-field]');
    // Itera sobre a lista de elementos e preenche cada um
    elementsToFill.forEach(element => {
        // Obtém o nome do campo a partir do atributo data-field
        const fieldName = element.dataset.field;

        // Verifica se o dado existe no nosso objeto 'dataToFill'
        if (dataToFill[fieldName] !== undefined) {
            // Preenche o conteúdo do elemento
            element.textContent = dataToFill[fieldName];
        }
    });
    li.style.backgroundColor = getRandomTranslucentColor();

    li.querySelector('.delete-log').addEventListener('click', function () {
        li.remove();
        if (logList.children.length === 0) {
            logList.innerHTML = '<li class="empty-logs">Nenhum registro ainda. Digite algo no campo acima.</li>';
        }
        saveLogsToStorage();
    });

    logList.prepend(li);
    saveLogsToStorage();
}

// Função para salvar logs no localStorage
function saveLogsToStorage() {
    const logs = [];
    document.querySelectorAll('#logList li').forEach(li => {
        if (!li.classList.contains('empty-logs')) {
            // Detecta se é um log de conversão ou log de texto
            if (li.querySelector('.log-moeda')) {
                logs.push({
                    moeda: li.querySelector('.log-moeda').textContent,
                    dataCotacao: li.querySelector('.log-data').textContent,
                    venda: li.querySelector('.log-venda').textContent,
                    vendaInversa: li.querySelector('.log-venda-inversa').textContent,
                    compra: li.querySelector('.log-compra').textContent,
                    compraInversa: li.querySelector('.log-compra-inversa').textContent,
                    time: li.querySelector('.log-time').textContent,
                    tipo: 'conversao'
                });
            } else {
                logs.push({
                    value: li.querySelector('.log-value').textContent,
                    time: li.querySelector('.log-time').textContent,
                    tipo: 'texto'
                });
            }
        }
    });
    localStorage.setItem('inputLogs', JSON.stringify(logs));
}

// Gera uma cor RGBA aleatória com baixa opacidade, sem repetir a última cor
let lastColorIdx = null;
function getRandomTranslucentColor() {
    const colors = [
        [52, 152, 219],   // azul
        [46, 204, 113],   // verde
        [241, 196, 15],   // amarelo
        [231, 76, 60],    // vermelho
        [155, 89, 182],   // roxo
        [230, 126, 34],   // laranja
        [26, 188, 156],   // turquesa
        [243, 156, 18],   // laranja escuro
        [135, 206, 250],  // azul claro
        [144, 238, 144],  // verde claro
        [255, 99, 132],   // vermelho vibrante
        [218, 112, 214],  // roxo claro
        [241, 169, 160],  // rosa claro
        [22, 160, 133],   // verde água
        [236, 112, 99],   // vermelho claro
        [244, 208, 63]    // amarelo claro
    ];
    let idx;
    do {
        idx = Math.floor(Math.random() * colors.length);
    } while (idx === lastColorIdx && colors.length > 1);
    lastColorIdx = idx;
    const [r, g, b] = colors[idx];
    return `rgba(${r},${g},${b},0.18)`;
}


// Função para carregar logs do localStorage
function loadLogsFromStorage() {
    const savedLogs = localStorage.getItem('inputLogs');
    if (savedLogs) {
        let logs = JSON.parse(savedLogs);
        if (logList.querySelector('.empty-logs')) {
            logList.innerHTML = '';
        }
        // Ordenar por horário decrescente (mais recente primeiro)
        logs = logs.sort((a, b) => {
            // Converter para Date para garantir ordenação correta
            const dateA = new Date('1970-01-01T' + a.time);
            const dateB = new Date('1970-01-01T' + b.time);
            return dateB - dateA;
        });
        logs.forEach(log => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="log-value">${log.value}</span>
                <span class="log-time">${log.time}</span>
                <button class="delete-log" title="Apagar log" style="background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;margin-left:10px;">Apagar</button>
            `;
            li.style.backgroundColor = getRandomTranslucentColor();
            li.querySelector('.delete-log').addEventListener('click', function () {
                li.remove();
                if (logList.children.length === 0) {
                    logList.innerHTML = '<li class="empty-logs">Nenhum registro ainda. Digite algo no campo acima.</li>';
                }
                saveLogsToStorage();
            });
            logList.appendChild(li);
        });
    }
}

// Função para processar cotação de moeda PTAX
async function processarCotacaoMoeda(codigoMoeda, dataCotacao) {
    try {
        // Instanciar a API do Banco Central (browser)
        if (typeof window.BancoCentralAPI !== 'function') {
            throw new Error('BancoCentralAPI não está disponível. Certifique-se de incluir bc-api.js via <script> no HTML.');
        }
        const bcAPI = new window.BancoCentralAPI();

        // Obter a cotação PTAX usando a API
        const resultado = await bcAPI.getCotacaoMoedaDiaPTAX(codigoMoeda, dataCotacao);

        if (!resultado.success) {
            return resultado;
        }

        const cotacaoPTAX = resultado.data;
        const cotacaoRealMoeda = parseFloat(cotacaoPTAX.cotacaoVenda);
        const cotacaoRealMoedaInversa = 1 / cotacaoRealMoeda;
        const cotacaoMoedaReal = parseFloat(cotacaoPTAX.cotacaoCompra);
        const cotacaoMoedaRealInversa = 1 / cotacaoMoedaReal;

        return {
            success: true,
            data: {
                moeda: codigoMoeda,
                dataCotacao: cotacaoPTAX.dataHoraCotacao,
                contacaoRealMoeda: cotacaoRealMoeda,
                contacaoRealMoedaInversa: cotacaoRealMoedaInversa,
                contacaoMoedaReal: cotacaoMoedaReal,
                contacaoMoedaRealInversa: cotacaoMoedaRealInversa,
                dadosOriginais: cotacaoPTAX
            },
            timestamp: resultado.timestamp,
            message: resultado.message
        };
    } catch (error) {
        console.error('Erro ao processar cotação:', error);
        return {
            success: false,
            message: error.message,
            data: null
        };
    }
}
