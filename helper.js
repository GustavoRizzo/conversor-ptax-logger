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
