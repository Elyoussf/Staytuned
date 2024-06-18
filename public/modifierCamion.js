const urlParams = new URLSearchParams(window.location.search);
const old_imma = urlParams.get('immatriculation');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('immatriculation').value = urlParams.get('immatriculation');
    document.getElementById('type').value = urlParams.get('type');
    document.getElementById('kilometrage').value = urlParams.get('kilometrage');
    document.getElementById('dernierVidangeDate').value = urlParams.get('dernierVidangeDate');
    document.getElementById('dernierVidangeKilometrage').value = urlParams.get('dernierVidangeKilometrage');
    
})

const modifier = document.querySelector('button');

modifier.addEventListener('click', (e) => {
    e.preventDefault();
    const camionForm = document.getElementById('camionForm');
    const formData = new FormData(camionForm);
    const res = Object.fromEntries(formData);
    const payload = JSON.stringify(res);

    if (old_imma !== res.immatriculation) {
        alert("Tu as changé l'immatriculation : si c'est prévu merci d'ajouter ce nouveau camion au lieu de le modifier");
    } else {
        
        fetch('http://127.0.0.1:5000/camions/update', {
            method: 'POST',
            body: JSON.stringify({
                immatriculation: res.immatriculation,
                type: res.type,
                kilometrage: res.kilometrage,
                dernierVidangeDate: res.dernierVidangeDate,
                dernierVidangeKilometrage: res.dernierVidangeKilometrage,
                details : res.details
            }),
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            credentials: 'include'
        }).then(() => {
            console.log("Update successful");
            window.location.href = './afficherCamions.html';
        }).catch((err) => {
            console.log("Update failed: ", err);
        });
    }
});

