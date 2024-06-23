const address = "https://staytuned-l16q7u3uq-hamzas-projects-7f3b1634.vercel.app";
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const immatriculation = urlParams.get('immatriculation');
    const h1 = document.querySelector('h1');
    h1.innerText+=` ${immatriculation}`

    async function fetchData(immatriculation) {
        try {
            const response = await fetch(`${address}/camions/${immatriculation}`, {
                method: 'GET',
                credentials: 'include'
            });

            // Check for successful response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let tbody = document.querySelector('tbody');
            let n = data.vidanges.length;
            for (let i = n - 1; i >= 0; i--) {
                renderVidange(data.vidanges[i], tbody);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors appropriately, e.g., display an error message to the user
        }
    }

    const renderVidange = (vidange, tbody) => {
        const newRow = document.createElement('tr');
        tbody.appendChild(newRow);
        newRow.innerHTML = `
            <td>${new Date(vidange.date).toLocaleDateString()}</td>
            <td>${vidange.kilometrage}</td>
            <td>${vidange.cout}</td>
            <td class="details">${vidange.details}</td>
        `;
    };

    fetchData(immatriculation);
});
