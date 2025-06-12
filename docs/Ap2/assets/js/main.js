/**
 * Arquivo principal de JavaScript
 * Contém funcionalidades gerais do site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do menu mobile
    initMobileMenu();

    // Ativa o link atual no menu de navegação
    highlightCurrentPage();
});

/**
 * Inicializa o menu mobile com toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');

        // Acessibilidade: Alterna o atributo aria-expanded
        const isExpanded = menu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('active')) {
            menu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });
}

/**
 * Destaca o item de menu correspondente à página atual
 */
function highlightCurrentPage() {
    // Obtém o caminho atual da URL
    const currentPath = window.location.pathname;

    // Seleciona todos os links do menu
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        // Obtém o caminho do link
        const linkPath = link.getAttribute('href');

        // Verifica se o caminho atual termina com o caminho do link
        if (currentPath.endsWith(linkPath)) {
            // Remove a classe 'active' de todos os links
            menuLinks.forEach(item => item.classList.remove('active'));

            // Adiciona a classe 'active' ao link atual
            link.classList.add('active');
        }
    });
}

/**
 * Formata valores monetários para o formato brasileiro
 * @param {number} value - O valor a ser formatado
 * @param {string} currency - O código da moeda (padrão: BRL)
 * @returns {string} Valor formatado
 */
export function formatCurrency(value, currency = 'BRL') {
    // Garante que o valor seja um número
    if (isNaN(value)) {
        console.warn('Tentativa de formatar valor não numérico:', value);
        return 'N/A';
    }

    try {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    } catch (error) {
        console.error('Erro ao formatar valor monetário:', error);
        // Fallback simples em caso de erro
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}

/**
 * Formata valores percentuais
 * @param {number} value - O valor a ser formatado
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} Valor formatado com símbolo de percentual
 */
export function formatPercent(value, decimals = 2) {
    // Garante que o valor seja um número
    if (isNaN(value)) {
        console.warn('Tentativa de formatar percentual não numérico:', value);
        return 'N/A';
    }

    try {
        // Divide por 100 apenas se o valor for maior que 1 (assume que o valor já está em formato decimal)
        const normalizedValue = value > 1 ? value / 100 : value;

        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(normalizedValue);
    } catch (error) {
        console.error('Erro ao formatar percentual:', error);
        // Fallback simples em caso de erro
        return `${value.toFixed(decimals).replace('.', ',')}%`;
    }
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {Date|string} date - A data a ser formatada
 * @param {boolean} includeTime - Se deve incluir o horário
 * @returns {string} Data formatada
 */
export function formatDate(date, includeTime = false) {
    if (!date) {
        return 'Data indisponível';
    }

    try {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        // Tenta converter string para data se necessário
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Verifica se a data é válida
        if (isNaN(dateObj.getTime())) {
            throw new Error('Data inválida');
        }

        return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
    } catch (error) {
        console.error('Erro ao formatar data:', error, date);
        return 'Data inválida';
    }
}

/**
 * Exibe uma mensagem de alerta personalizada
 * @param {string} message - A mensagem a ser exibida
 * @param {string} type - O tipo de alerta (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos (0 para não desaparecer)
 */
export function showAlert(message, type = 'info', duration = 3000) {
    // Cria o elemento de alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;

    // Adiciona o alerta ao corpo do documento
    document.body.appendChild(alertElement);

    // Após 100ms, adiciona a classe 'show' para ativar a animação
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 100);

    // Remove o alerta após a duração especificada
    if (duration > 0) {
        setTimeout(() => {
            // Primeiro remove a classe show
            alertElement.classList.remove('show');

            // Após a transição, remove o elemento
            setTimeout(() => {
                document.body.removeChild(alertElement);
            }, 300);
        }, duration);
    }
}
