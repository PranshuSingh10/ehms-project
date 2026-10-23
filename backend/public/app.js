async function submitJsonForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = {};
  const message = form.parentElement.querySelector(".message");

  for (const [key, value] of new FormData(form).entries()) {
    payload[key] = value;
  }

  try {
    const response = await fetch(form.dataset.endpoint, {
      method: form.dataset.method || "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    if (message) {
      message.className = "message success";
      message.textContent = "Saved successfully. Reloading view...";
    }

    setTimeout(() => {
      window.location.reload();
    }, 600);
  } catch (error) {
    if (message) {
      message.className = "message error";
      message.textContent = error.message;
    }
  }
}

async function assignBed(button) {
  const bedId = button.dataset.bedId;
  const select = document.querySelector(`[data-bed-select="${bedId}"]`);

  if (!select || !select.value) {
    window.alert("Select a patient first.");
    return;
  }

  const response = await fetch(`/api/beds/${bedId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patientId: select.value })
  });

  const data = await response.json();

  if (!response.ok) {
    window.alert(data.error || "Assignment failed");
    return;
  }

  window.location.reload();
}

async function releaseBed(button) {
  const bedId = button.dataset.bedId;
  const response = await fetch(`/api/beds/${bedId}/release`, {
    method: "POST"
  });

  const data = await response.json();

  if (!response.ok) {
    window.alert(data.error || "Release failed");
    return;
  }

  window.location.reload();
}

document.querySelectorAll("[data-json-form]").forEach((form) => {
  form.addEventListener("submit", submitJsonForm);
});

document.querySelectorAll("[data-bed-assign]").forEach((button) => {
  button.addEventListener("click", () => assignBed(button));
});

document.querySelectorAll("[data-bed-release]").forEach((button) => {
  button.addEventListener("click", () => releaseBed(button));
});
