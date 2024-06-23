const address = "";
document.addEventListener('DOMContentLoaded', async () => {
    const userInput = window.prompt("entrer le mot de passe pour ajouter");
    
                  const response = await fetch(`${address}/verify-key`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ secret_key: userInput })
                });
    
                const result = await response.json();  
                if (result.success){

    const camionForm = document.getElementById('camionForm');
    const inputs = [
        document.getElementById('immatriculation'),
        document.getElementById('type'),
        document.getElementById('kilometrage'),
        document.getElementById('dernierVidangeDate'),
        document.getElementById('dernierVidangeKilometrage'),
        document.getElementById('cout'),
        document.getElementById('details'),
        
    ];

    camionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(camionForm);
        const res = Object.fromEntries(formData);
        const payload = JSON.stringify(res);
      

        try {
            const response = await fetch(`${address}/camions`, {
                method: "POST",
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
//if (!response.ok) {
  //             throw new Error('Network response was not ok');
    //        }

            // Clear form inputs
            inputs.forEach(input => input.value = '');

            // Redirect to another page
           window.location.href = './afficherCamions.html';
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
}else{
    window.location.href = `${address}/afficherCamions.html` 
}});