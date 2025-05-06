const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2504-FTB-ET-WEB-FT";
const API = BASE + COHORT;

// === State ===
let parties = [];
let selectedParty = null;

// === API Functions ===
async function getParties() {
  const res = await fetch(API + "/events");
  const data = await res.json();
  parties = data.data;
  render();
}

async function createParty(party) {
  await fetch(API + "/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(party),
  });
  await getParties();
}

async function deleteParty(id) {
  await fetch(API + "/events/" + id, { method: "DELETE" });
  selectedParty = null;
  await getParties();
}

async function selectParty(id) {
  const res = await fetch(API + "/events/" + id);
  const data = await res.json();
  selectedParty = data.data;
  render();
}

// === Components ===
function NewPartyForm() {
  const form = document.createElement("form");

  const name = document.createElement("input");
  name.placeholder = "Party Name";
  name.required = true;

  const desc = document.createElement("input");
  desc.placeholder = "Description";
  desc.required = true;

  const date = document.createElement("input");
  date.type = "date";
  date.required = true;

  const location = document.createElement("input");
  location.placeholder = "Location";
  location.required = true;

  const button = document.createElement("button");
  button.textContent = "Add Party";
  button.type = "submit";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createParty({
      name: name.value,
      description: desc.value,
      date: date.value,
      location: location.value,
    });
    form.reset();
  });

  form.append(name, desc, date, location, button);
  return form;
}

function PartyList() {
  const ul = document.createElement("ul");
  parties.forEach((party) => {
    const li = document.createElement("li");
    li.textContent = party.name;
    li.addEventListener("click", () => selectParty(party.id));
    ul.appendChild(li);
  });
  return ul;
}

function SelectedParty() {
  const section = document.createElement("section");
  if (!selectedParty) {
    section.textContent = "Select a party to see details.";
    return section;
  }

  section.innerHTML = `
    <h3>${selectedParty.name}</h3>
    <p>${selectedParty.description}</p>
    <p>Date: ${selectedParty.date.slice(0, 10)}</p>
    <p>Location: ${selectedParty.location}</p>
  `;

  const del = document.createElement("button");
  del.textContent = "Delete Party";
  del.addEventListener("click", () => deleteParty(selectedParty.id));

  section.appendChild(del);
  return section;
}

// === Render ===
function render() {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  app.append(
    NewPartyForm(),
    document.createElement("hr"),
    PartyList(),
    SelectedParty()
  );
}

// === Init ===
getParties();
