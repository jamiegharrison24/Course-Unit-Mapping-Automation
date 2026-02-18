function validateEmailDomain(email) {
    const domain = email.split('@')[1];
    return domain.toLowerCase().endsWith('.edu');
}