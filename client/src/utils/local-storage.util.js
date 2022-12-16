export const getProfileFromLocalStorage = () => {
    const profile = localStorage.getItem('profile');

    return JSON.parse(profile);
};
