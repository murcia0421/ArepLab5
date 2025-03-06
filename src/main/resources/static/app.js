const API_URL = "http://localhost:8080/properties";

let currentPage = 1;
const pageSize = 5;

// Cargar propiedades al iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
    setupSearchForm();
    setupPaginationButtons();
});

// Cargar la lista de propiedades con paginación
async function loadProperties(page = 1) {
    currentPage = page;
    try {
        const response = await fetch(`${API_URL}?page=${page}&size=${pageSize}`);
        if (!response.ok) {
            throw new Error("Error al cargar las propiedades");
        }
        const data = await response.json();
        renderProperties(data.content); // Cambia 'properties' a 'content' si es necesario
        renderPagination(data.totalPages);
    } catch (error) {
        showMessage("Error al cargar las propiedades: " + error.message, "error");
    }
}

// Renderizar la tabla de propiedades
function renderProperties(properties) {
    const tbody = document.querySelector("#propertyTable tbody");
    tbody.innerHTML = "";

    properties.forEach(property => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${property.id}</td>
            <td>${property.address}</td>
            <td>${property.price}</td>
            <td>${property.size}</td>
            <td>${property.description}</td>
            <td>
                <button onclick="editProperty(${property.id})">Editar</button>
                <button onclick="deleteProperty(${property.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar los botones de paginación
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.classList.add("pagination-btn");
        if (i === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => loadProperties(i));
        paginationContainer.appendChild(button);
    }
}

// Manejar el formulario para agregar/editar propiedades
document.getElementById("propertyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const propertyId = document.getElementById("propertyId").value;
    const property = {
        address: document.getElementById("address").value,
        price: parseFloat(document.getElementById("price").value),
        size: parseFloat(document.getElementById("size").value),
        description: document.getElementById("description").value
    };

    const method = propertyId ? "PUT" : "POST";
    const url = propertyId ? `${API_URL}/${propertyId}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(property)
        });

        if (!response.ok) {
            throw new Error("Error al guardar la propiedad");
        }

        const result = await response.json();
        showMessage(`Propiedad ${propertyId ? "actualizada" : "creada"} exitosamente`, "success");
        loadProperties();
        document.getElementById("propertyForm").reset();
        document.getElementById("propertyId").value = "";
    } catch (error) {
        showMessage("Error al guardar la propiedad: " + error.message, "error");
    }
});

// Editar una propiedad
async function editProperty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Error al cargar la propiedad");
        }
        const property = await response.json();

        document.getElementById("propertyId").value = property.id;
        document.getElementById("address").value = property.address;
        document.getElementById("price").value = property.price;
        document.getElementById("size").value = property.size;
        document.getElementById("description").value = property.description;
    } catch (error) {
        showMessage("Error al cargar la propiedad: " + error.message, "error");
    }
}

// Eliminar una propiedad
async function deleteProperty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Error al eliminar la propiedad");
        }
        showMessage("Propiedad eliminada exitosamente", "success");
        loadProperties();
    } catch (error) {
        showMessage("Error al eliminar la propiedad: " + error.message, "error");
    }
}

// Configurar el formulario de búsqueda
function setupSearchForm() {
    document.getElementById("searchForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const address = document.getElementById("searchAddress").value;
        const minPrice = document.getElementById("minPrice").value;
        const maxPrice = document.getElementById("maxPrice").value;
        const minSize = document.getElementById("minSize").value;
        const maxSize = document.getElementById("maxSize").value;

        let queryParams = [];

        if (address) queryParams.push(`address=${encodeURIComponent(address)}`);
        if (minPrice) queryParams.push(`minPrice=${minPrice}`);
        if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
        if (minSize) queryParams.push(`minSize=${minSize}`);
        if (maxSize) queryParams.push(`maxSize=${maxSize}`);

        const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
        try {
            const response = await fetch(`${API_URL}/search${queryString}`);
            if (!response.ok) {
                throw new Error("Error al buscar propiedades");
            }
            const properties = await response.json();
            renderProperties(properties);
        } catch (error) {
            showMessage("Error al buscar propiedades: " + error.message, "error");
        }
    });
}

// Configurar botones de paginación iniciales
function setupPaginationButtons() {
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            loadProperties(currentPage - 1);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        loadProperties(currentPage + 1);
    });
}

// Mostrar mensajes de éxito o error
function showMessage(message, type) {
    const messageContainer = document.getElementById("messageContainer");
    if (!messageContainer) {
        console.error("No se encontró el contenedor de mensajes");
        return;
    }

    messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = "";
    }, 5000); // Ocultar el mensaje después de 5 segundos
}