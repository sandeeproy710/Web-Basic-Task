import { hostelService } from "../service/hostelService.js";

export class UI {
  private form: HTMLFormElement;
  private tableBody: HTMLTableSectionElement;
  private statsDiv: HTMLDivElement;
  private roomSelect: HTMLSelectElement;
  private editResidentId: string | null = null;
  private searchInput: HTMLInputElement;

  constructor(private service: hostelService) {
    this.searchInput = document.getElementById(
      "residentSearch",
    ) as HTMLInputElement;
    this.form = document.getElementById("residentFormMain") as HTMLFormElement;
    this.tableBody = document.getElementById(
      "residentRows",
    ) as HTMLTableSectionElement;
    this.statsDiv = document.getElementById("roomStatsBox") as HTMLDivElement;
    this.roomSelect = document.getElementById(
      "roomPick",
    ) as HTMLSelectElement;

    this.init();
  }

  private init(): void {
    this.populateRoomDropdown();
    this.renderResidents();
    this.renderStats();
    this.handleFormSubmit();
    this.handleTableClick();
    this.handleSearch();
  }

  // Populate vacant rooms; when editing, also include the resident's current room
  private populateRoomDropdown(selectedRoomNumber?: number): void {
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
      const currentRoom = allRooms.find(
        (r) => r.roomNumber === selectedRoomNumber,
      );
      if (
        currentRoom &&
        !roomsToShow.some((r) => r.roomNumber === selectedRoomNumber)
      ) {
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
      if (
        selectedRoomNumber !== undefined &&
        room.roomNumber === selectedRoomNumber
      ) {
        option.selected = true;
      }
      this.roomSelect.appendChild(option);
    });
  }

  private renderResidents(): void {
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

  private renderStats(): void {
    const stats = this.service.getRoomStates();

    this.statsDiv.innerHTML = `
      <p>Total Rooms: ${stats.total}</p>
      <p>Occupied Rooms: ${stats.occupied}</p>
      <p>Vacant Rooms: ${stats.vacant}</p>
    `;
  }

  private handleFormSubmit(): void {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = (document.getElementById("residentName") as HTMLInputElement)
        .value;
      const age = Number(
        (document.getElementById("residentAge") as HTMLInputElement).value,
      );
      const phone = (
        document.getElementById("residentPhone") as HTMLInputElement
      ).value;
      const roomNumber = Number(this.roomSelect.value);
      const checkInDate = (
        document.getElementById("dateJoin") as HTMLInputElement
      ).value;

      try {
        if (this.editResidentId) {
          // update existing resident
          this.service.updateResident(
            this.editResidentId,
            name,
            age,
            phone,
            roomNumber,
            checkInDate,
          );
        } else {
          // create new resident
          this.service.addResident(name, age, phone, roomNumber, checkInDate);
        }

        this.editResidentId = null;
        this.form.reset();
        this.populateRoomDropdown();
        this.renderResidents();
        this.renderStats();
      } catch (error: any) {
        alert(error.message);
      }
    });
  }

  private handleTableClick(): void {
    this.tableBody.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const id = target.getAttribute("data-id");
      if (!id) return;

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

  private startEdit(id: string): void {
    const residents = this.service.getResidents;
    const resident = residents.find((r) => r.id === id);
    if (!resident) return;

    this.editResidentId = id;

    (document.getElementById("residentName") as HTMLInputElement).value =
      resident.name;
    (document.getElementById("residentAge") as HTMLInputElement).value =
      resident.age.toString();
    (document.getElementById("residentPhone") as HTMLInputElement).value =
      resident.phone;
    (document.getElementById("dateJoin") as HTMLInputElement).value =
      resident.checkIndate;

    this.populateRoomDropdown(resident.roomNumber);
  }
  private handleSearch(): void {
  this.searchInput.addEventListener("input", () => {
    const searchTerm = this.searchInput.value.toLowerCase();

    const residents = this.service.getResidents.filter((resident) =>
      resident.name.toLowerCase().includes(searchTerm)
    );

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
