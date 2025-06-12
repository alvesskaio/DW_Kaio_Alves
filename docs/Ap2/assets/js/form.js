/**
 * Módulo para validação e processamento de formulários
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se existe um formulário de contato na página
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initContactForm(contactForm);
    }
});

/**
 * Inicializa o formulário de contato com validação
 * @param {HTMLFormElement} form - O formulário de contato
 */
function initContactForm(form) {
    // Elementos do formulário
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    const subjectSelect = form.querySelector('#subject');
    const messageTextarea = form.querySelector('#message');
    const privacyCheckbox = form.querySelector('#privacy');

    // Elementos de erro
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    const privacyError = document.getElementById('privacy-error');

    // Status do formulário
    const formStatus = document.getElementById('form-status');

    // Adiciona listener de validação nos inputs
    nameInput.addEventListener('input', () => validateName(nameInput, nameError));
    emailInput.addEventListener('input', () => validateEmail(emailInput, emailError));
    phoneInput.addEventListener('input', () => validatePhone(phoneInput, phoneError));
    subjectSelect.addEventListener('change', () => validateSelect(subjectSelect, subjectError));
    messageTextarea.addEventListener('input', () => validateMessage(messageTextarea, messageError));
    privacyCheckbox.addEventListener('change', () => validateCheckbox(privacyCheckbox, privacyError));

    // Adiciona o listener de submit ao formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Valida todos os campos
        const isNameValid = validateName(nameInput, nameError);
        const isEmailValid = validateEmail(emailInput, emailError);
        const isPhoneValid = validatePhone(phoneInput, phoneError);
        const isSubjectValid = validateSelect(subjectSelect, subjectError);
        const isMessageValid = validateMessage(messageTextarea, messageError);
        const isPrivacyValid = validateCheckbox(privacyCheckbox, privacyError);

        // Verifica se todos os campos obrigatórios são válidos
        if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid && isPrivacyValid) {
            // Simulação de envio do formulário
            submitForm(form);
        }
    });
}

/**
 * Validação de campo de nome
 * @returns {boolean} - Verdadeiro se válido
 */
function validateName(input, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: não pode estar vazio e não pode conter números
    const value = input.value.trim();
    if (value === '') {
        errorElement.textContent = 'Por favor, informe seu nome.';
        errorElement.classList.add('active');
        return false;
    }

    if (/\d/.test(value)) {
        errorElement.textContent = 'O nome não deve conter números.';
        errorElement.classList.add('active');
        return false;
    }

    return true;
}

/**
 * Validação de campo de email
 * @returns {boolean} - Verdadeiro se válido
 */
function validateEmail(input, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: não pode estar vazio e deve ser um email válido
    const value = input.value.trim();
    if (value === '') {
        errorElement.textContent = 'Por favor, informe seu e-mail.';
        errorElement.classList.add('active');
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
        errorElement.textContent = 'Por favor, informe um e-mail válido.';
        errorElement.classList.add('active');
        return false;
    }

    return true;
}

/**
 * Validação de campo de telefone
 * @returns {boolean} - Verdadeiro se válido
 */
function validatePhone(input, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: se preenchido, deve ser um telefone válido
    const value = input.value.trim();
    if (value === '') {
        return true; // Telefone é opcional
    }

    // Remove caracteres não numéricos para validar
    const numericValue = value.replace(/\D/g, '');

    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    if (numericValue.length < 10) {
        errorElement.textContent = 'Por favor, informe um telefone válido com DDD.';
        errorElement.classList.add('active');
        return false;
    }

    // Formata o número enquanto digita
    let formattedValue = '';
    if (numericValue.length <= 11) {
        formattedValue = numericValue.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
        input.value = formattedValue;
    }

    return true;
}

/**
 * Validação de campo select
 * @returns {boolean} - Verdadeiro se válido
 */
function validateSelect(select, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: deve ter uma opção selecionada
    if (select.value === '') {
        errorElement.textContent = 'Por favor, selecione uma opção.';
        errorElement.classList.add('active');
        return false;
    }

    return true;
}

/**
 * Validação de campo de mensagem
 * @returns {boolean} - Verdadeiro se válido
 */
function validateMessage(textarea, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: não pode estar vazio e deve ter um tamanho mínimo
    const value = textarea.value.trim();
    if (value === '') {
        errorElement.textContent = 'Por favor, escreva sua mensagem.';
        errorElement.classList.add('active');
        return false;
    }

    if (value.length < 10) {
        errorElement.textContent = 'A mensagem deve ter pelo menos 10 caracteres.';
        errorElement.classList.add('active');
        return false;
    }

    return true;
}

/**
 * Validação de checkbox
 * @returns {boolean} - Verdadeiro se válido
 */
function validateCheckbox(checkbox, errorElement) {
    // Limpa erros anteriores
    errorElement.textContent = '';
    errorElement.classList.remove('active');

    // Validação: deve estar marcado
    if (!checkbox.checked) {
        errorElement.textContent = 'Você precisa concordar com a política de privacidade.';
        errorElement.classList.add('active');
        return false;
    }

    return true;
}

/**
 * Simula o envio do formulário
 * @param {HTMLFormElement} form - O formulário a ser enviado
 */
function submitForm(form) {
    // Obtém o status do formulário
    const formStatus = document.getElementById('form-status');

    // Mostra mensagem de carregamento
    formStatus.textContent = 'Enviando mensagem...';
    formStatus.className = 'form-status loading';
    formStatus.style.display = 'block';

    // Simula uma requisição com timeout
    setTimeout(() => {
        // Aleatoriamente simula sucesso ou erro (apenas para demonstração)
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            // Mensagem de sucesso
            formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
            formStatus.className = 'form-status success';

            // Limpa o formulário
            form.reset();
        } else {
            // Mensagem de erro
            formStatus.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.';
            formStatus.className = 'form-status error';
        }
    }, 1500);
}
