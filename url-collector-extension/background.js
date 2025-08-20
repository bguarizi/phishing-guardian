
// Função para enviar a mensagem para o content.js
function sendMessage(mensagem, type) {
    // Obtém a aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, { mensagem: mensagem, type: type });
        }
    });
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0) { // Verifica se é o frame principal (não um iframe)
        const url = details.url;
        sendUrlToServer(url);
    }
});

function sendUrlToServer(url) {
    fetch('http://localhost:5000/receive_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);
        if (data.message) {

            sendMessage(data.message, data.type);

        } else {
            sendMessage('Resposta do servidor vazia ou inválida.', -1);
        }
    })
    .catch(error => {
        sendMessage("ERRO DE COMUNICAÇÃO!\nVerifique se o software está executando corretamente.\nCaso não queira mais receber este alerta, desative a extensão nas configurações do navegador.", "1");
    });
}


