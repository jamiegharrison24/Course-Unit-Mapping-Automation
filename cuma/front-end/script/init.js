async function initializeApp() {
    const user = await fetchUser();
    localStorage.setItem('userRole', user.role);
    document.dispatchEvent(new CustomEvent('userInfoReady', { detail: user }));
}

async function fetchUser() {
    return Backend.Auth.getUserInfo().then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to fetch user info');
        }
    }).catch((error) => {
        console.error(error);
    });
 }

document.addEventListener('DOMContentLoaded', initializeApp);