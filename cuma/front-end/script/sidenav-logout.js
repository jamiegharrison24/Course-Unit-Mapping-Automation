function userLogout() {
    Backend.Auth.logout().then((response) => {
            if (response.status === 200) {
                alert(response.result.message);
                localStorage.clear();
            }
        }).catch(error => {
            console.error("An error occurred during logout:", error);
            alert("An error occurred during logout. Please try again.");
    });
}