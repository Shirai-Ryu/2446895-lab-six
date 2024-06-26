const apiBaseUrl = 'https://mango-meadow-04ca6a810.5.azurestaticapps.net';

document.addEventListener('DOMContentLoaded', () => {
    const loadCarsBtn = document.getElementById('loadCarsBtn');
    const carList = document.getElementById('carList');
    let cars = [];

    loadCarsBtn.addEventListener('click', () => {
        fetch(`${apiBaseUrl}/GetCars`)
            .then(response => response.json())
            .then(data => {
                cars = data;
                carList.innerHTML = '';
                data.forEach((car, index) => {
                    const carCard = document.createElement('div');
                    carCard.classList.add('car-card');
                    carCard.innerHTML = `
                        <h2>${car.make} ${car.model}</h2>
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Price:</strong> R${car.price}</p>
                        <button class="btn btn-remove" data-index="${index}">Remove</button>
                    `;
                    carList.appendChild(carCard);
                });
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
            });
    });

    const carForm = document.getElementById('carForm');
    carForm.addEventListener('submit', event => {
        event.preventDefault();
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const color = document.getElementById('color').value; // Assuming you have a color input
        const price = document.getElementById('price').value;
        addCar({ make, model, year, color, price });
        carForm.reset();
    });

    function addCar(newCar) {
        fetch(`${apiBaseUrl}/AddCar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadCarsBtn.click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function removeCar(index) {
        const carId = cars[index].id;
        fetch(`${apiBaseUrl}/DeleteCar/${carId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadCarsBtn.click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    carList.addEventListener('click', event => {
        if (event.target.classList.contains('btn-remove')) {
            const index = event.target.dataset.index;
            removeCar(index);
        }
    });
});

