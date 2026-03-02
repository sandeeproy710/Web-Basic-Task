export class UI {
    constructor(service) {
        this.service = service;
        this.editResidentId = null;
        this.searchInput = document.getElementById("residentSearch");
        this.form = document.getElementById("residentFormMain");
        this.tableBody = document.getElementById("residentRows");
        this.statsDiv = document.getElementById("roomStatsBox");
        this.roomSelect = document.getElementById("roomPick");
        this.init();
    }
    init() {
        this.populateRoomDropdown();
        this.renderResidents();
        this.renderStats();
        this.handleFormSubmit();
        this.handleTableClick();
        this.handleSearch();
    }
    // Populate vacant rooms; when editing, also include the resident's current room
    populateRoomDropdown(selectedRoomNumber) {
        this.roomSelect.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a Room";
        defaultOption.disabled = true;
        defaultOption.hidden = true;
        defaultOption.selected = true;
        this.roomSelect.appendChild(defaultOption);
        const vacantRooms = this.service.getVacantRooms();
        let roomsToShow = [...vacantRooms];
        if (selectedRoomNumber !== undefined) {
            const allRooms = this.service.getRooms;
            const currentRoom = allRooms.find((r) => r.roomNumber === selectedRoomNumber);
            if (currentRoom &&
                !roomsToShow.some((r) => r.roomNumber === selectedRoomNumber)) {
                roomsToShow.push(currentRoom);
            }
        }
        if (roomsToShow.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No Vacant Rooms";
            option.disabled = true;
            option.selected = true;
            this.roomSelect.appendChild(option);
            return;
        }
        roomsToShow.sort((a, b) => a.roomNumber - b.roomNumber);
        roomsToShow.forEach((room) => {
            const option = document.createElement("option");
            option.value = room.roomNumber.toString();
            option.textContent = `Room ${room.roomNumber}`;
            if (selectedRoomNumber !== undefined &&
                room.roomNumber === selectedRoomNumber) {
                option.selected = true;
            }
            this.roomSelect.appendChild(option);
        });
    }
    renderResidents() {
        this.tableBody.innerHTML = "";
        const residents = this.service.getResidents;
        residents.forEach((resident) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${resident.name}</td>
        <td>${resident.age}</td>
        <td>${resident.phone}</td>
        <td>${resident.roomNumber}</td>
        <td>${resident.checkIndate}</td>
        <td>
          <button data-id="${resident.id}" class="edit-btn">Edit</button>
          <button data-id="${resident.id}" class="delete-btn">Delete</button>
        </td>
      `;
            this.tableBody.appendChild(row);
        });
    }
    renderStats() {
        const stats = this.service.getRoomStates();
        this.statsDiv.innerHTML = `
      <p>Total Rooms: ${stats.total}</p>
      <p>Occupied Rooms: ${stats.occupied}</p>
      <p>Vacant Rooms: ${stats.vacant}</p>
    `;
    }
    handleFormSubmit() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("residentName")
                .value;
            const age = Number(document.getElementById("residentAge").value);
            const phone = document.getElementById("residentPhone").value;
            const roomNumber = Number(this.roomSelect.value);
            const checkInDate = document.getElementById("dateJoin").value;
            try {
                if (this.editResidentId) {
                    // update existing resident
                    this.service.updateResident(this.editResidentId, name, age, phone, roomNumber, checkInDate);
                }
                else {
                    // create new resident
                    this.service.addResident(name, age, phone, roomNumber, checkInDate);
                }
                this.editResidentId = null;
                this.form.reset();
                this.populateRoomDropdown();
                this.renderResidents();
                this.renderStats();
            }
            catch (error) {
                alert(error.message);
            }
        });
    }
    handleTableClick() {
        this.tableBody.addEventListener("click", (event) => {
            const target = event.target;
            const id = target.getAttribute("data-id");
            if (!id)
                return;
            if (target.classList.contains("delete-btn")) {
                this.service.removeResident(id);
                this.renderResidents();
                this.renderStats();
                this.populateRoomDropdown();
            }
            if (target.classList.contains("edit-btn")) {
                this.startEdit(id);
            }
        });
    }
    startEdit(id) {
        const residents = this.service.getResidents;
        const resident = residents.find((r) => r.id === id);
        if (!resident)
            return;
        this.editResidentId = id;
        document.getElementById("residentName").value =
            resident.name;
        document.getElementById("residentAge").value =
            resident.age.toString();
        document.getElementById("residentPhone").value =
            resident.phone;
        document.getElementById("dateJoin").value =
            resident.checkIndate;
        this.populateRoomDropdown(resident.roomNumber);
    }
    handleSearch() {
        this.searchInput.addEventListener("input", () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            const residents = this.service.getResidents.filter((resident) => resident.name.toLowerCase().includes(searchTerm));
            this.tableBody.innerHTML = "";
            residents.forEach((resident) => {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${resident.name}</td>
        <td>${resident.age}</td>
        <td>${resident.phone}</td>
        <td>${resident.roomNumber}</td>
        <td>${resident.checkIndate}</td>
        <td>
          <button data-id="${resident.id}" class="edit-btn">Edit</button>
          <button data-id="${resident.id}" class="delete-btn">Delete</button>
        </td>
      `;
                this.tableBody.appendChild(row);
            });
        });
    }
}
