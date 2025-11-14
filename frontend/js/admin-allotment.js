// admin-allotment.js
(async function(){
  const hostelSelect = document.getElementById('hostelSelect');
  const roomSelect = document.getElementById('roomSelect');
  const hostelFilter = document.getElementById('hostelFilter');
  const roomsTableBody = document.querySelector('#roomsTable tbody');
  const hostelSummaryEl = document.getElementById('hostelSummary');

  // load hostels and populate selects
  async function loadHostels() {
    const res = await apiGet('/api/hostels');
    const hostels = res?.hostels || [];
    hostelSelect.innerHTML = '<option value="">Select Hostel</option>';
    hostelFilter.innerHTML = '<option value="">All hostels</option>';
    hostels.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.name; opt.textContent = h.name;
      hostelSelect.appendChild(opt);
      const opt2 = opt.cloneNode(true);
      hostelFilter.appendChild(opt2);
    });
  }

  // load rooms (with occupancy) and render table + hostel summary
  async function loadRooms(filterHostel='') {
    const res = await apiGet('/api/rooms');
    const rows = res?.rooms || [];
    const filtered = filterHostel ? rows.filter(r => r.hostel_name === filterHostel) : rows;
    roomsTableBody.innerHTML = '';
    // hostel summary
    const summary = {};
    rows.forEach(r => {
      if (!summary[r.hostel_name]) summary[r.hostel_name] = { totalRooms:0, occupiedRooms:0, totalVacantSlots:0 };
      summary[r.hostel_name].totalRooms += 1;
      const vacantSlots = Math.max(0, r.capacity - r.occupied);
      if (r.occupied >= r.capacity) summary[r.hostel_name].occupiedRooms += 1;
      summary[r.hostel_name].totalVacantSlots += vacantSlots;
    });
    hostelSummaryEl.innerHTML = Object.keys(summary).map(h => {
      const s = summary[h];
      return `<div style="margin-bottom:8px;padding:10px;border-radius:8px;background:#fff;">
        <strong>${h}</strong> — Rooms: ${s.totalRooms}, Fully occupied: ${s.occupiedRooms}, Vacant slots: ${s.totalVacantSlots}
      </div>`;
    }).join('') || '<p>No hostels found</p>';

    // table rows
    filtered.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.hostel_name}</td>
                      <td>${r.room_number}</td>
                      <td>${r.capacity}</td>
                      <td>${r.occupied}</td>
                      <td>${Math.max(0, r.capacity - r.occupied)}</td>`;
      roomsTableBody.appendChild(tr);
    });
  }

  // populate available rooms for selected hostel
  async function populateAvailableRooms(hostelName) {
    roomSelect.innerHTML = '<option value="">Select Room (will show available rooms)</option>';
    if (!hostelName) return;
    const res = await apiGet('/api/rooms');
    const rows = res?.rooms || [];
    // show only rooms of this hostel where occupied < capacity
    rows.filter(r => r.hostel_name === hostelName && r.occupied < r.capacity)
      .forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id; // room id
        opt.textContent = `${r.room_number} — Vacant slots: ${r.capacity - r.occupied}`;
        roomSelect.appendChild(opt);
    });
  }

  // handle add + allot form submit
  document.getElementById('addAndAllotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    // 1) add student record
    const studentBody = {
      student_id: body.student_id,
      name: body.name,
      phone: body.phone || null,
      hostel_name: body.hostel_name,
      room_number: '' // will be mirrored after allotment
    };
    const addRes = await apiPost('/api/students', studentBody);
    if (!addRes || addRes.error) {
      showMsg('msg', 'Failed to add student: ' + (addRes?.error || 'Server error'), true);
      return;
    }

    // 2) allot the student to selected room
    const allotBody = { student_id: body.student_id, room_id: Number(body.room_id) };
    const allotRes = await apiPost('/api/allotments', allotBody);
    if (!allotRes || allotRes.error) {
      showMsg('msg', 'Student added but allotment failed: ' + (allotRes?.error || 'Server error'), true);
      // you may want to remove student record in failure case — up to admin
      return;
    }

    showMsg('msg', 'Student added and allotted successfully', false);
    e.target.reset();
    await loadRooms();
  });

  // filter rooms by hostel
  hostelFilter.addEventListener('change', (e) => {
    loadRooms(e.target.value);
  });

  // when hostelSelect changes, populate available rooms
  hostelSelect.addEventListener('change', (e) => populateAvailableRooms(e.target.value));

  // initial load
  await loadHostels();
  await loadRooms();
})();
