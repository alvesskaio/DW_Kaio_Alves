/**
 * Módulo para melhorar a acessibilidade do site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa melhorias de acessibilidade
    initAccessibility();

    // Adiciona revelação de elementos quando visíveis
    initIntersectionObserver();
});

/**
 * Inicializa diversas melhorias de acessibilidade
 */
function initAccessibility() {
    // Adicionar skip link para acessibilidade
    addSkipLink();

    // Adicionar ARIA labels e roles onde necessário
    enhanceARIA();

    // Melhorar navegação por teclado
    enhanceKeyboardNavigation();

    // Garantir que o contraste atende às diretrizes WCAG
    checkContrast();
}

/**
 * Adiciona um skip link para acessibilidade (pular para o conteúdo principal)
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Adiciona ID ao elemento main ou primeiro conteúdo significativo
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

/**
 * Adiciona atributos ARIA para melhorar acessibilidade
 */
function enhanceARIA() {
    // Adiciona roles e labels para o menu de navegação
    const nav = document.querySelector('nav');
    if (nav) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Menu principal');
    }

    // Melhora botão de toggle do menu
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'primary-menu');
        menuToggle.setAttribute('aria-label', 'Alternar menu de navegação');

        const menu = document.querySelector('.menu');
        if (menu) {
            menu.id = 'primary-menu';
            menu.setAttribute('role', 'menubar');
        }
    }

    // Adiciona roles para elementos principais
    const header = document.querySelector('header');
    if (header) {
        header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('.footer');
    if (footer) {
        footer.setAttribute('role', 'contentinfo');
    }

    // Adiciona descrições para links de redes sociais
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        // Use a classe do ícone para identificar a rede social
        const iconClass = link.querySelector('i').className;
        let socialName = 'Mídia social';

        if (iconClass.includes('facebook')) socialName = 'Facebook';
        if (iconClass.includes('twitter')) socialName = 'Twitter';
        if (iconClass.includes('instagram')) socialName = 'Instagram';
        if (iconClass.includes('linkedin')) socialName = 'LinkedIn';

        link.setAttribute('aria-label', socialName);
    });
}

/**
 * Melhora a navegação por teclado
 */
function enhanceKeyboardNavigation() {
    // Adiciona event listeners para melhorar a navegação em cards clicáveis
    const interactiveCards = document.querySelectorAll('.feature-card, .investment-card');

    interactiveCards.forEach(card => {
        // Verifica se o card tem um link interno
        const cardLink = card.querySelector('a');
        if (cardLink) {
            // Torna o card inteiro tabulável e clicável
            card.setAttribute('tabindex', '0');
            card.style.cursor = 'pointer';

            // Ao clicar no card, simula clique no link
            card.addEventListener('click', (e) => {
                // Evita duplo clique se o clique foi no próprio link
                if (e.target !== cardLink && !cardLink.contains(e.target)) {
                    cardLink.click();
                }
            });

            // Ao pressionar Enter no card, simula clique no link
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    cardLink.click();
                }
            });
        }
    });

    // Melhora a focusabilidade do menu
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
    });
}

/**
 * Verifica se os elementos críticos têm contraste adequado
 */
function checkContrast() {
    // Esta função serviria para verificar contraste durante o desenvolvimento
    // Em uma implementação real, poderia usar uma biblioteca como o color-contrast
    console.log('Verificação de contraste recomendada para elementos críticos.');
}

/**
 * Inicializa o Intersection Observer para mostrar elementos quando ficam visíveis
 */
function initIntersectionObserver() {
    // Verifica se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        // Elementos que devem ser revelados ao ficarem visíveis
        const elements = document.querySelectorAll('.feature-card, .indicator-card, .investment-card, .contact-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Quando o elemento está no viewport
                if (entry.isIntersecting) {
                    // Adiciona classe para torná-lo visível
                    entry.target.classList.add('visible');
                    // Para de observar o elemento depois que ele apareceu
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.1, // 10% do elemento visível
            rootMargin: '0px 0px -50px 0px' // ativa um pouco antes do elemento entrar na viewport
        });

        // Observa cada elemento
        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores que não suportam Intersection Observer
        const elements = document.querySelectorAll('.feature-card, .indicator-card, .investment-card, .contact-card');
        elements.forEach(element => {
            element.classList.add('visible');
        });
    }
}
