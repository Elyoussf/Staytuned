const address = process.env.server;
const ar=[];
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(`${address}/camions`,{credentials: 'include'}); // Assuming your Express endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      let responseData = await response.text(); // Get the response as text
      
      try {
        responseData = JSON.parse(responseData); // Attempt to parse it as JSON
        // Handle double-encoded JSON string
        if (typeof responseData === 'string') {
          responseData = JSON.parse(responseData);
        }
      } catch (e) {
        throw new Error('Failed to parse JSON:', e);
      }
  
     

  
      if (Array.isArray(responseData)) {
        
        responseData.forEach(displayTruck);  // Display each truck in the table
        
            const subject = "vidange alerte";
            let body = "Les immatriculations des camions qui auront besoin de vidange avec les kilomètres restant pour chacun:\n ";
            let n = ar.length;
            for (let i=0;i<n;i++){
              body+=`${ar[i][0]} : apres ${ar[i][1]} km \n`
            }

if (n>0){


            fetch(`${address}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({subject, body }),
                credentials: 'include'
            })
            .then(response => response.text())
            .then(data => {
                console.log("sent")
            })
            .catch(error => {
                console.error('Error:', error);
            });}
      } else if (responseData.camions && Array.isArray(responseData.camions)) {
        
        // Check if responseData has a 'camions' property that is an array
        responseData.camions.forEach(displayTruck);  // Display each truck in the table
      } else {
        throw new Error('Expected an array but got:', responseData);
      }
    } catch (error) {
      console.error('Error fetching trucks:', error);
      window.location.href="landPage.html"
    }
  });
  
  const tableBody = document.querySelector('tbody');
  
  function displayTruck(truck) {
   
    const tableRow = document.createElement('tr');
    tableRow.className="warning"
  
    let lastVidangeDate = 'Pas de vidanges enregistrées';
    
    const lastVidange = truck.vidanges[truck.vidanges.length - 1];
    if (truck.vidanges && truck.vidanges.length > 0) {
    
      
      lastVidangeDate = new Date(lastVidange.date).toLocaleDateString(); // Format the date
      
    }
  if (10000-(truck.kilometrage-lastVidange.kilometrage)<=1000) {tableRow.style.backgroundColor = "#eed202"
    tableRow.style.color = "black"
   const index = truck.immatriculation
   const val = (10000-(truck.kilometrage-lastVidange.kilometrage))
    ar.push([index,val])
    

  }
  tableRow.innerHTML = `
                    <td>${truck.immatriculation}</td>
                    <td>${truck.type}</td>
                    <td>${truck.kilometrage}</td>
                    <td>${lastVidangeDate}</td>
                    <td>${10000-(truck.kilometrage-lastVidange.kilometrage )}</td>
                    <td>
                        <button class="history-button" data-id="${truck.immatriculation}">Afficher l'historique</button>
                        
                    </td>
                       <td>
                        
                        <button class="delete-button" data-id="${truck.immatriculation}">Delete</button>
                        <button class="update-button" data-id="${truck._id}">Actualiser</button>
                    </td>
                `;
  
    tableBody.appendChild(tableRow);
  }
  
  // Optional: Add event listener to handle history button clicks (if needed)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('history-button')) {
      const truckId = e.target.dataset.id;
     

        // Construct the query string
        const queryString = `?immatriculation=${encodeURIComponent(truckId)}`;

        // Redirect to modifierCamions.html with the query string
        window.location.href = `./vidangeHistory.html${queryString}`;
    }
  });
 



   tableBody.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-button')) {
                  const userInput = window.prompt("entrer le mot de passe pour supprimer");
                  const response = await fetch('/verify-key', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ secret_key: userInput })
                });
              
                const result = await response.json();  
                if (result.success){

                


                    const rowToDelete = e.target.closest('tr');
                    const truckId = e.target.dataset.id;
                    const immatriculation = truckId;
                    try{
                      fetch(`${address}/camions/${immatriculation}`,{method:'DELETE',credentials: 'include'})
   
                        rowToDelete.remove();
                      
                    }catch(error){console.error("error: ",error)}
                    
                  }else{
                    alert("mot de passe invalide")
                  }
                }
           } );
  tableBody.addEventListener('click',async (e)=>{
    e.preventDefault();
      if (e.target.classList.contains('update-button')) {
       
        const truckId = e.target.dataset.id;
        const row = e.target.closest('tr');
        const immatriculation = row.querySelector('td:nth-child(1)').textContent;
        const type = row.querySelector('td:nth-child(2)').textContent;
        const kilometrage = row.querySelector('td:nth-child(3)').textContent;
        const dernierVidangeDate = row.querySelector('td:nth-child(4)').textContent;
        const kilometrageRestant = row.querySelector('td:nth-child(5)').textContent;

      const x = kilometrage-(10000-kilometrageRestant)
        // Construct the query string
        const queryString = `?immatriculation=${encodeURIComponent(immatriculation)}&type=${encodeURIComponent(type)}&kilometrage=${encodeURIComponent(kilometrage)}&dernierVidangeDate=${encodeURIComponent(dernierVidangeDate)}&dernierVidangeKilometrage=${encodeURIComponent(x)}`;

        // Redirect to modifierCamions.html with the query string
        window.location.href = `./modifierCamions.html${queryString}`;
    }   }

  )

  document.querySelector('.logout').addEventListener('click', async function() {
    try {
        const response = await fetch(`${address}/api/logout`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        const result = await response.json();

        window.location.href = `${address}/`
        // Optionally redirect to login page
    } catch (error) {
        console.error('Error:', error);
        alert('Logout failed');
    }
});
document.getElementById('showButton').addEventListener('click', function() {
  var buttonContainer = document.getElementById('buttonContainer');
  buttonContainer.classList.toggle('show');
});