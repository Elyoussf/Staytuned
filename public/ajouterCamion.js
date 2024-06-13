document.addEventListener('DOMContentLoaded', () => {
    const camionForm = document.getElementById('camionForm');
    const inputs = [
        document.getElementById('immatriculation'),
        document.getElementById('type'),
        document.getElementById('kilometrage'),
        document.getElementById('dernierVidangeDate'),
        document.getElementById('dernierVidangeKilometrage'),
        document.getElementById('details')
    ];

    camionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(camionForm);
        const res = Object.fromEntries(formData);
        const payload = JSON.stringify(res);
        console.log(res)

        try {
            const response = await fetch('http://127.0.0.1:5000/camions', {
                method: "POST",
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

           // if (!response.ok) {
             //   throw new Error('Network response was not ok');
            //}

            // Clear form inputs
            inputs.forEach(input => input.value = '');

            // Redirect to another page
           window.location.href = './afficherCamions.html';
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
});