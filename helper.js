// Função para adicionar um log
function addLog(value) {
    // Remover mensagem de lista vazia se existir
    if (logList.querySelector('.empty-logs')) {
        logList.innerHTML = '';
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const li = document.createElement('li');
    li.innerHTML = `
                    <span class="log-value">${value}</span>
                    <span class="log-time">${timeString}</span>
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

    logList.prepend(li); // Adicionar no início da lista

    // Salvar logs no localStorage
    saveLogsToStorage();
}

// Função para salvar logs no localStorage
function saveLogsToStorage() {
    const logs = [];
    document.querySelectorAll('#logList li').forEach(li => {
        if (!li.classList.contains('empty-logs')) {
            logs.push({
                value: li.querySelector('.log-value').textContent,
                time: li.querySelector('.log-time').textContent
            });
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
