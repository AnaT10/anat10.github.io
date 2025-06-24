// Aguarda o carregamento completo do DOM (Document Object Model) antes de executar o script.
// Isso garante que todos os elementos HTML estejam disponíveis para serem manipulados.
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos HTML principais usando seus IDs.
    const blocosContainer = document.getElementById('blocosContainer'); // Contêiner para os blocos de questões
    const addBlocoBtn = document.getElementById('addBlocoBtn');         // Botão para adicionar novo bloco
    const calcularBtn = document.getElementById('calcularBtn');         // Botão para calcular a nota
    const limparBtn = document.getElementById('limparBtn');             // Botão para limpar os campos
    const resultadoDiv = document.getElementById('resultado');         // Div onde o resultado será exibido
    const messageBox = document.getElementById('messageBox');           // Div para mensagens de erro/sucesso
    const totalQuestoesProvaInput = document.getElementById('totalQuestoesProva'); // Campo para o total de questões da prova

    let blocoIdCounter = 0; // Contador para gerar IDs únicos para cada bloco de questões (começa em 0 para o primeiro ser 'bloco1')

    /**
     * Exibe uma mensagem na caixa de mensagens.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo da mensagem ('success' para verde, 'error' para vermelho).
     */
    function showMessage(message, type) {
        // Remove classes de estado anteriores e adiciona as novas para estilização
        messageBox.classList.remove('hidden', 'success', 'error');
        messageBox.classList.add(type);
        // Define o conteúdo da mensagem
        messageBox.innerHTML = `<p>${message}</p>`;
        messageBox.style.display = 'block'; // Garante que a caixa de mensagem está visível

        // Oculta a mensagem automaticamente após 5 segundos
        setTimeout(() => {
            messageBox.style.display = 'none';
            messageBox.classList.add('hidden'); // Adiciona 'hidden' novamente para ocultar completamente
        }, 5000);
    }

    /**
     * Cria e retorna um novo elemento HTML de bloco de questões.
     * @param {string} nomePadrao - Nome padrão para o campo de nome do bloco.
     * @param {number} pesoPadrao - Peso padrão para o campo de peso do bloco.
     * @returns {HTMLElement} - O elemento div que representa o novo bloco.
     */
    function createBlocoHtml(nomePadrao = '', pesoPadrao = 1) {
        blocoIdCounter++; // Incrementa o contador para garantir um ID único para o novo bloco
        const newBloco = document.createElement('div'); // Cria um novo elemento div
        newBloco.className = 'bloco-item border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm'; // Adiciona classes de estilo

        // Define o HTML interno para o novo bloco, usando o contador para IDs únicos
        newBloco.innerHTML = `
            <div class="flex flex-col sm:flex-row items-center justify-between mb-4">
                <label for="nomeBloco${blocoIdCounter}" class="sr-only">Nome do Bloco ${blocoIdCounter}</label>
                <input type="text" id="nomeBloco${blocoIdCounter}" placeholder="Nome do Bloco (ex: Específicos)" value="${nomePadrao}"
                       class="flex-grow shadow-sm appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 mr-0 sm:mr-4 mb-3 sm:mb-0 w-full sm:w-auto">
                <label for="pesoBloco${blocoIdCounter}" class="sr-only">Peso do Bloco ${blocoIdCounter}</label>
                <input type="number" id="pesoBloco${blocoIdCounter}" min="1" value="${pesoPadrao}" placeholder="Peso"
                       class="w-20 shadow-sm appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span class="ml-2 text-gray-600">x</span>
                <button type="button" class="remover-bloco-btn ml-4 text-red-500 hover:text-red-700 transition-colors" title="Remover este bloco">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="input-group">
                            <label for="acertos${blocoIdCounter}" class="block text-gray-700 text-sm font-semibold mb-1">Certos:</label>
                            <input type="number" id="acertos${blocoIdCounter}" min="0" value="0"
                                   class="acertos-input shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        </div>
                        <div class="input-group">
                            <label for="erros${blocoIdCounter}" class="block text-gray-700 text-sm font-semibold mb-1">Errados:</label>
                            <input type="number" id="erros${blocoIdCounter}" min="0" value="0"
                                   class="erros-input shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        </div>
                        <div class="input-group">
                            <label for="emBranco${blocoIdCounter}" class="block text-gray-700 text-sm font-semibold mb-1">Em Branco:</label>
                            <input type="number" id="emBranco${blocoIdCounter}" min="0" value="0"
                                   class="em-branco-input shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        </div>
                    </div>
                `;
        return newBloco; // Retorna o elemento HTML recém-criado
    }

    /**
     * Adiciona um novo bloco de questões ao contêiner de blocos na página.
     * @param {string} nome - Nome do bloco a ser adicionado.
     * @param {number} peso - Peso do bloco a ser adicionado.
     */
    function addBlocoDynamically(nome = '', peso = 1) { // Renomeada para evitar conflito com a chamada inicial
        const newBloco = createBlocoHtml(nome, peso); // Cria um novo bloco com nome e peso especificados
        blocosContainer.appendChild(newBloco); // Adiciona o novo bloco ao DOM
        updateRemoveButtonsVisibility(); // Atualiza a visibilidade dos botões de remoção
    }

    /**
     * Remove um bloco de questões específico do DOM.
     * @param {Event} event - O objeto de evento do clique (usado para encontrar o botão e seu bloco pai).
     */
    function removerBloco(event) {
        // Encontra o elemento '.bloco-item' mais próximo (o bloco pai do botão de remover)
        const blocoToRemove = event.target.closest('.bloco-item');
        if (blocoToRemove) {
            // Remove o bloco encontrado do contêiner
            blocosContainer.removeChild(blocoToRemove);
            updateRemoveButtonsVisibility(); // Atualiza a visibilidade dos botões de remoção
        }
    }

    /**
     * Controla a visibilidade dos botões de remoção de bloco.
     * Eles são ocultados se houver apenas um bloco, para evitar que o último seja removido.
     */
    function updateRemoveButtonsVisibility() {
        // Seleciona todos os botões de remoção
        const removerBtns = document.querySelectorAll('.remover-bloco-btn');
        if (removerBtns.length <= 1) {
            // Se houver 1 ou menos blocos, esconde todos os botões de remoção
            removerBtns.forEach(btn => btn.classList.add('hidden'));
        } else {
            // Caso contrário, mostra todos os botões de remoção
            removerBtns.forEach(btn => btn.classList.remove('hidden'));
        }
    }

    /**
     * Calcula a nota líquida total com base nos dados de todos os blocos e exibe o resultado.
     * Realiza validações para garantir que os inputs são válidos.
     */
    function calcularNota() {
        let notaLiquidaTotal = 0;
        let totalAcertosGeral = 0;
        let totalErrosGeral = 0;
        let totalEmBrancoGeral = 0;
        let totalQuestoesSomadasDosBlocos = 0;

        // Seleciona todos os elementos de bloco de questões
        const blocos = document.querySelectorAll('.bloco-item');
        // Obtém o valor do total de questões da prova, convertendo para inteiro
        const totalQuestoesProva = parseInt(totalQuestoesProvaInput.value);

        // Esconde o resultado anterior e qualquer mensagem antes de um novo cálculo
        resultadoDiv.style.display = 'none';
        messageBox.style.display = 'none';

        // Verifica se há pelo menos um bloco para calcular
        if (blocos.length === 0) {
            showMessage('Adicione pelo menos um bloco de questões para calcular.', 'error');
            return; // Interrompe a função se não houver blocos
        }

        // Itera sobre cada bloco de questões para coletar dados e calcular
        for (const bloco of blocos) {
            // Obtém os elementos de input dentro do bloco atual
            const nomeBloco = bloco.querySelector('input[type="text"]').value.trim();
            const pesoInput = bloco.querySelector('input[type="number"]:not(.acertos-input):not(.erros-input):not(.em-branco-input)');
            const acertosInput = bloco.querySelector('.acertos-input');
            const errosInput = bloco.querySelector('.erros-input');
            const emBrancoInput = bloco.querySelector('.em-branco-input');

            // Converte os valores dos inputs para números inteiros
            const peso = parseInt(pesoInput.value);
            const acertos = parseInt(acertosInput.value);
            const erros = parseInt(errosInput.value);
            const emBranco = parseInt(emBrancoInput.value);

            // Validação dos inputs de cada bloco
            if (isNaN(peso) || peso < 1 ||
                isNaN(acertos) || acertos < 0 ||
                isNaN(erros) || erros < 0 ||
                isNaN(emBranco) || emBranco < 0) {
                showMessage(`Por favor, verifique os campos do bloco "${nomeBloco || 'Sem Nome'}". Todos devem ser números válidos e positivos, e o peso deve ser no mínimo 1.`, 'error');
                return; // Interrompe a função em caso de validação falha
            }

            // Cálculo da nota líquida para o bloco atual: (acertos - erros) * peso
            const notaBloco = (acertos - erros) * peso;
            notaLiquidaTotal += notaBloco; // Soma à nota total

            // Acumula os totais gerais de acertos, erros e em branco
            totalAcertosGeral += acertos;
            totalErrosGeral += erros;
            totalEmBrancoGeral += emBranco;
            // Soma o total de questões marcadas/respondidas/em branco para validação futura
            totalQuestoesSomadasDosBlocos += (acertos + erros + emBranco);
        }

        // Validações adicionais relacionadas ao total de questões da prova (se preenchido)
        if (totalQuestoesProva > 0 && totalQuestoesSomadasDosBlocos > totalQuestoesProva) {
            showMessage(`A soma das questões nos blocos (${totalQuestoesSomadasDosBlocos}) excede o total de questões na prova (${totalQuestoesProva}). Por favor, ajuste os valores.`, 'error');
            return;
        }
        if (totalQuestoesProva > 0 && totalQuestoesSomadasDosBlocos < totalQuestoesProva) {
             showMessage(`A soma das questões nos blocos (${totalQuestoesSomadasDosBlocos}) é menor que o total de questões na prova (${totalQuestoesProva}). Por favor, ajuste os valores.`, 'error');
            return;
        }


        // Limpa classes anteriores e define as classes padrão para a exibição do resultado de sucesso
        resultadoDiv.className = 'message-box success p-6 rounded-lg mt-8 text-center text-xl font-bold text-blue-800 border border-blue-200';
        // Exibe a nota líquida final e os totais gerais no elemento 'resultadoDiv'
        resultadoDiv.innerHTML = `
            <p>Sua Nota Líquida Final é: <span class="text-blue-700 text-3xl font-extrabold">${notaLiquidaTotal}</span> pontos</p>
            <p class="text-sm text-gray-600 mt-2">Total de Acertos: ${totalAcertosGeral} | Total de Erros: ${totalErrosGeral} | Total em Branco: ${totalEmBrancoGeral}</p>
            ${totalQuestoesProva > 0 ? `<p class="text-sm text-gray-600 mt-1">Total de Questões na Prova: ${totalQuestoesProva}</p>` : ''}
        `;
        resultadoDiv.style.display = 'block'; // Torna a div de resultado visível
    }

    /**
     * Limpa todos os campos da calculadora, resetando-a para o estado inicial.
     */
    function limparCampos() {
        // Zera o campo de total de questões da prova
        totalQuestoesProvaInput.value = 0;

        // Remove todos os blocos existentes no contêiner
        const blocos = document.querySelectorAll('.bloco-item');
        blocos.forEach(bloco => blocosContainer.removeChild(bloco));


        // Reseta o contador de IDs para 0 e adiciona o bloco inicial "Conhecimentos Básicos"
        blocoIdCounter = 0;
        addBlocoDynamically('Conhecimentos Básicos', 1);

        // Adiciona o bloco "Conhecimentos Específicos" automaticamente após limpar
        addBlocoDynamically('Conhecimentos Específicos', 2);


        resultadoDiv.style.display = 'none'; // Esconde a área de resultado
        messageBox.style.display = 'none';   // Esconde a caixa de mensagens
        updateRemoveButtonsVisibility();     // Garante que o botão de remover do primeiro bloco esteja oculto
    }

    // --- Inicialização da página ---
    // Adiciona o bloco inicial "Conhecimentos Básicos" e "Conhecimentos Específicos" ao carregar a página.
    // O 'blocoIdCounter' começa em 0 para que a primeira chamada adicione 'nomeBloco1', etc.
    addBlocoDynamically('Conhecimentos Básicos', 1);
    addBlocoDynamically('Conhecimentos Específicos', 2);


    // Adiciona os ouvintes de evento aos botões principais
    addBlocoBtn.addEventListener('click', () => addBlocoDynamically('Novo Bloco', 1)); // Passa nome e peso padrão para novos blocos
    calcularBtn.addEventListener('click', calcularNota);   // Ao clicar, calcula a nota
    limparBtn.addEventListener('click', limparCampos);     // Ao clicar, limpa todos os campos

    // Adiciona um ouvinte de evento 'click' ao contêiner dos blocos para lidar com cliques nos botões de remover.
    // Isso usa "delegação de evento", o que é eficiente para elementos que são adicionados/removidos dinamicamente.
    blocosContainer.addEventListener('click', function(event) {
        // Verifica se o clique foi em um botão com a classe 'remover-bloco-btn' (ou um de seus filhos)
        if (event.target.closest('.remover-bloco-btn')) {
            removerBloco(event); // Chama a função para remover o bloco
        }
    });

    // Inicializa a visibilidade dos botões de remoção no carregamento da página.
    // O botão de remover do primeiro bloco deve estar oculto, já que ele é o único.
    updateRemoveButtonsVisibility();
});
