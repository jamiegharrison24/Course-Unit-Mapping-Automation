// index.js

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const editButton = document.getElementById('edit-button');
    const modal = document.getElementById('edit-profile-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelButton = document.getElementById('cancel-button');
    const saveButton = document.getElementById('save-button');

    (async () => {
        try {
            const user = await fetchUser();
            document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`
            document.getElementById('profile-role').textContent = user.role
            document.getElementById('profile-email').textContent = user.email
        } catch (error) {
            console.error("An error occurred while retrieving user info:", error);
            alert('Error:' + error);
        }
    })();
    

    // Function to open the modal and populate fields
    function openModal() {
        populateModalFields();
        modal.style.display = 'block';
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Function to populate modal fields with current profile data
    function populateModalFields() {
        document.getElementById('modal-profile-name').value = document.getElementById('profile-name').textContent.trim();
        document.getElementById('modal-profile-role').value = document.getElementById('profile-role').textContent.trim();
        document.getElementById('modal-profile-email').value = document.getElementById('profile-email').textContent.trim();
        document.getElementById('modal-profile-phone').value = document.getElementById('profile-phone').textContent.trim();
        document.getElementById('modal-profile-language').value = document.getElementById('profile-language').textContent.trim();
        document.getElementById('modal-profile-timezone').value = document.getElementById('profile-timezone').textContent.trim();
    }

    // Function to save profile changes
    function saveProfileChanges() {
        // Get values from modal inputs
        const name = document.getElementById('modal-profile-name').value.trim();
        const role = document.getElementById('modal-profile-role').value.trim(); // Readonly
        const email = document.getElementById('modal-profile-email').value.trim();
        const phone = document.getElementById('modal-profile-phone').value.trim();
        const language = document.getElementById('modal-profile-language').value.trim();
        const timezone = document.getElementById('modal-profile-timezone').value.trim();

        // Basic validation
        if (name === '' || email === '') {
            alert('Name and Email are required fields.');
            return;
        }

        // Update the profile display on the main page
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-role').textContent = role;
        document.getElementById('profile-email').textContent = email;
        document.getElementById('profile-phone').textContent = phone;
        document.getElementById('profile-language').textContent = language;
        document.getElementById('profile-timezone').textContent = timezone;

        // Close the modal
        closeModal();

        // implent db logic here

    }

    // Event listeners
    editButton.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    saveButton.addEventListener('click', saveProfileChanges);

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
});
