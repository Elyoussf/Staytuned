const address = process.env.NEXT_PUBLIC_API_URL;
const urlParams = new URLSearchParams(window.location.search);
const old_imma = urlParams.get('immatriculation');

document.addEventListener('DOMContentLoaded', async() => {
    const userInput = window.prompt("entrer le mot de passe pour modifier");
    const response = await fetch('/verify-key', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secret_key: userInput })
  });

  const result = await response.json();  
  if (result.success){

  
    document.getElementById('immatriculation').value = urlParams.get('immatriculation');
    document.getElementById('type').value = urlParams.get('type');
    document.getElementById('kilometrage').value = urlParams.get('kilometrage');
    document.getElementById('dernierVidangeDate').value = urlParams.get('dernierVidangeDate');
    document.getElementById('dernierVidangeKilometrage').value = urlParams.get('dernierVidangeKilometrage');
    
}else{
    window.location.href = `${address}/afficherCamions.html`
}})

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
        
        fetch(`${address}/camions/update`, {
            method: 'POST',
            body: JSON.stringify({
                immatriculation: res.immatriculation,
                type: res.type,
                kilometrage: res.kilometrage,
                dernierVidangeDate: res.dernierVidangeDate,
                dernierVidangeKilometrage: res.dernierVidangeKilometrage,
                cout:res.cout,
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

