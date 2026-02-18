document.addEventListener('DOMContentLoaded', () => {
    // Fetch users from database
    fetchUsers();

    // Add event listeners for navigation tabs
    document.querySelectorAll('#navigation li').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Add event listener for search input
    document.getElementById('search-input').addEventListener('input', filterUserList);

    // Add event listeners for action buttons
    document.getElementById('approve-btn').addEventListener('click', () => {
        handleUserAction('approve');
    });
    document.getElementById('reject-btn').addEventListener('click', () => {
        handleUserAction('reject');
    });
    document.getElementById('delete-btn').addEventListener('click', () => {
        handleUserAction('delete');
    });

    // Add event listener for closing the modal
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('user-modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Placeholder logout button event listener
    document.getElementById('logout-btn').addEventListener('click', () => {
        Backend.Auth.logout().then((response) => {
                alert(response.result.message);
                console.log("Logout successful");
            }).catch(error => {
                console.error("An error occurred during logout:", error);
                alert("An error occurred during logout. Please try again.");
        });
    });
});

let selectedUserId = null;
let allUsers = [];
let currentTab = 'pending'; // 'pending' or 'approved'

function fetchUsers() {
    Backend.Admin.getAllUsers()
        .then(response => {
            if (response && response.status === 200) {
                allUsers = response.result.data
                populateUserList();
            } else {
                console.error('Failed to fetch users:', response ? response.status : 'No response');
                // display an error message to the user
                document.getElementById('user-list').innerHTML = '<li>Failed to load users. Please try again later.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            // display an error message to the user
            document.getElementById('user-list').innerHTML = '<li>An error occurred while loading users. Please try again later.</li>';
        });
}

function populateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear existing list

    const filteredUsers = allUsers.filter(user => {
        if (currentTab === 'pending') {
            return user.status === 'pending_role' || user.status === 'pending_verification';
        } else {
            return user.status;
        }
    });

    filteredUsers.forEach(user => {
        const listItem = document.createElement('li');
        listItem.dataset.userId = user._id;

        const userInfoDiv = document.createElement('div');
        userInfoDiv.classList.add('user-info');
        userInfoDiv.textContent = `${user.firstName} ${user.lastName} - ${user.email}`;

        const userStatusDiv = document.createElement('div');
        userStatusDiv.classList.add('user-status');

        // Change text based on the current tab
        if (currentTab === 'pending') {
            userStatusDiv.textContent = `Asking Role: ${formatRoles(user.askingRole || user.role)}`;
        } else {
            userStatusDiv.textContent = `Role: ${formatRoles(user.role)}`;
        }

        listItem.appendChild(userInfoDiv);
        listItem.appendChild(userStatusDiv);

        listItem.addEventListener('click', () => {
            displayUserDetails(user._id);
        });
        userList.appendChild(listItem);
    });
}

function formatRoles(roles) {
    if (!roles || roles.length === 0) return 'None';
    if (typeof roles === 'string') return formatKey(roles);
    return roles.map(role => formatKey(role)).join(', ');
}

function switchTab(tab) {
    currentTab = tab;

    // Update active tab styling
    document.querySelectorAll('#navigation li').forEach(li => {
        li.classList.toggle('active', li.dataset.tab === tab);
    });

    // Clear search input
    document.getElementById('search-input').value = '';

    // Repopulate user list
    populateUserList();
}

function filterUserList() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const userListItems = document.querySelectorAll('#user-list li');

    userListItems.forEach(item => {
        const userInfo = item.querySelector('.user-info').textContent.toLowerCase();
        if (userInfo.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function displayUserDetails(userId) {
    selectedUserId = userId;
    Backend.Admin.getUser(userId).then(response => {
        if (response && response.status === 200){
            const user = response.result.data;
            const userDetailsDiv = document.getElementById('user-details');
            userDetailsDiv.innerHTML = `
                    <p><strong>First Name:</strong> ${user.firstName}</p>
                    <p><strong>Last Name:</strong> ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Email Verified:</strong> ${user.emailVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Status:</strong> ${formatStatus(user.status)}</p>
                    <p><strong>${user.status === 'pending_role' ? 'Asking Role' : 'Role'}:</strong> ${formatRoles(user.askingRole || user.role)}</p>
                    <h3>Additional Information</h3>
                    ${formatAdditionalInfo(user.additional_info)}
            `;
            // Show or hide the role selection dropdown based on user status
            const roleSelectionDiv = document.getElementById('role-selection');
            if (user.status === 'active') {
                roleSelectionDiv.style.display = 'block';
                const roleSelect = document.getElementById('role-select');
                roleSelect.value = user.role || 'general_user';
            } else {
                roleSelectionDiv.style.display = 'none';
            }

             // Show or hide the Approve and Reject buttons based on user status
             const approveBtn = document.getElementById('approve-btn');
             const rejectBtn = document.getElementById('reject-btn');
             const deleteBtn = document.getElementById('delete-btn');

             if (user.status === 'pending_role' || user.status === 'pending_verification') {
                 approveBtn.innerHTML = '<i class="fas fa-check"></i> Approve';
                 approveBtn.style.display = 'inline-block';
                 rejectBtn.style.display = 'inline-block';
                 deleteBtn.style.display = 'inline-block';
             } else {
                 approveBtn.innerHTML = '<i class="fas fa-save"></i> Update';
                 approveBtn.style.display = 'inline-block';
                 rejectBtn.style.display = 'none';
                 deleteBtn.style.display = 'inline-block';
             }

             openModal();
        } else {
            console.error('Failed to fetch user details:', response ? response.status : 'No response');
            alert('Failed to load user details. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        alert('An error occurred while loading user details. Please try again.');
    });

}

function formatStatus(status) {
    // Convert status code to readable text
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatAdditionalInfo(additionalInfo) {
    if (!additionalInfo) return '<p>No additional information provided.</p>';
    let infoHtml = '<ul>';
    for (const key in additionalInfo) {
        if (additionalInfo.hasOwnProperty(key)) {
            infoHtml += `<li><strong>${formatKey(key)}:</strong> ${additionalInfo[key]}</li>`;
        }
    }
    infoHtml += '</ul>';
    return infoHtml;
}

function formatKey(key) {
    // Convert camelCase or snake_case to normal text
    return key.replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
}

function handleUserAction(action) {
    if (!selectedUserId) {
        alert('Please select a user first.');
        return;
    }

    const user = allUsers.find(u => u._id === selectedUserId);
    if (!user) {
        alert('Selected user not found.');
        return;
    }

    switch (action) {
        case 'approve':
            if (user.status === 'pending_role') {
                Backend.Admin.approveUserRole(selectedUserId)
                    .then(response => {
                        if (response && response.status === 200) {
                            alert('User approved successfully.');
                            user.status = 'active';
                            updateUI();
                        } else {
                            console.error('Failed to approve user:', response ? response.status : 'No response');
                            alert('Failed to approve user. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error approving user:', error);
                        alert('An error occurred while approving the user. Please try again.');
                    });
            } else {
                const selectedRole = document.getElementById('role-select').value;
                const roleSelectionDiv = document.getElementById('role-selection');

                if (roleSelectionDiv.style.display === 'none') {
                    alert('Cannot update user role.');
                    return;
                }
                Backend.Admin.updateUserRole(selectedUserId, selectedRole)
                    .then(response => {
                        if (response && response.status === 200) {
                            alert('User role updated successfully.');
                            user.role = selectedRole;
                            updateUI();
                        } else {
                            console.error('Failed to update user role:', response ? response.status : 'No response');
                            alert('Failed to update user role. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error updating user role:', error);
                        alert('An error occurred while updating the user role. Please try again.');
                    });
            }
            break;
        case 'reject':
            if (user.status === 'pending_role') {
                Backend.Admin.rejectUserRole(selectedUserId)
                    .then(response => {
                        if (response && response.status === 200) {
                            alert('User rejected successfully.');
                            user.status = 'rejected';
                            updateUI();
                        } else {
                            console.error('Failed to reject user:', response ? response.status : 'No response');
                            alert('Failed to reject user. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error rejecting user:', error);
                        alert('An error occurred while rejecting the user. Please try again.');
                    });
            }
            break;
        case 'delete':
            if (confirm('Are you sure you want to delete this user?')) {
                Backend.Admin.deleteUser(selectedUserId)
                    .then(response => {
                        if (response && response.status === 200) {
                            alert('User deleted successfully.');
                            allUsers = allUsers.filter(u => u._id !== selectedUserId);
                            updateUI();
                        } else {
                            console.error('Failed to delete user:', response ? response.status : 'No response');
                            alert('Failed to delete user. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting user:', error);
                        alert('An error occurred while deleting the user. Please try again.');
                    });
            }
            break;
        default:
            alert('Invalid action.');
    }
}

function updateUI() {
    populateUserList();
    closeModal();
}

function openModal() {
    const modal = document.getElementById('user-modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('user-modal');
    modal.style.display = 'none';
    selectedUserId = null;
}
