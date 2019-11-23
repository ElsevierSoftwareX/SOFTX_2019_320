var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const logout = () => {
    fetch("/logout", {
        method: "POST",
        headers: {
            'csrf-token': token
        }
    })
    .then(result => {
        if (result.ok) {
            window.location="/auth/login";
        }
        else {
            toastr.error("Προέκυψε ένα πρόβλημα, δοκιμάστε ξανά.");
        }
    })
    .catch(error => {
        toastr.error("Προέκυψε ένα πρόβλημα, δοκιμάστε ξανά.");
        console.log(error);
    });
};