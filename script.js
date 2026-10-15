"use strict";

/*
 * HER HEALTH — Women's Cancer Awareness
 * Educational symptom guidance only.
 * This app cannot diagnose cancer or identify cancerous cells.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("symptomForm") ||
    document.getElementById("symptom-form");

  const result =
    document.getElementById("result") ||
    document.getElementById("results");

  const resetButton =
    document.getElementById("resetButton") ||
    document.getElementById("reset-btn");

  if (!form || !result) {
    console.warn(
      "HER HEALTH: Could not find the symptom form or results area. " +
      "Check the IDs in index.html."
    );
    return;
  }

  const urgentKeywords = [
    "heavy bleeding",
    "severe pain",
    "fainting",
    "difficulty breathing",
    "chest pain"
  ];

  function getSelectedSymptoms() {
    return Array.from(
      form.querySelectorAll(
        'input[type="checkbox"]:checked'
      )
    ).map((input) => {
      const label = input.labels && input.labels[0];
      return (
        input.dataset.symptom ||
        (label ? label.textContent.trim() : input.value)
      );
    }).filter(Boolean);
  }

  function getDuration() {
    const field = form.querySelector(
      '[name="duration"], #duration, #symptomDuration'
    );

    return field ? field.value : "";
  }

  function showMessage(title, message, items = []) {
    result.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = title;
    result.appendChild(heading);

    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    result.appendChild(paragraph);

    if (items.length) {
      const list = document.createElement("ul");

      items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
      });

      result.appendChild(list);
    }

    result.hidden = false;
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");

    result.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function assessSymptoms(event) {
    event.preventDefault();

    const symptoms = getSelectedSymptoms();
    const duration = getDuration();

    if (symptoms.length === 0) {
      showMessage(
        "Select your symptoms",
        "Please select at least one symptom to receive general health guidance."
      );
      return;
    }

    const urgentMatch = symptoms.some((symptom) =>
      urgentKeywords.some((keyword) =>
        symptom.toLowerCase().includes(keyword)
      )
    );

    if (urgentMatch) {
      showMessage(
        "Seek urgent medical attention",
        "Some symptoms can indicate a medical emergency. Please seek urgent care now, especially if symptoms are severe or worsening."
      );
      return;
    }

    const advice = [
      "Arrange a medical appointment for new, persistent, unexplained, or worsening symptoms.",
      "Tell the clinician when the symptoms started and whether they are changing.",
      "Ask whether a breast examination, cervical screening, or other investigation is appropriate for you."
    ];

    if (duration === "weeks" || duration === "months") {
      advice.unshift(
        "Because the symptoms have persisted, please arrange a clinical assessment promptly."
      );
    }

    showMessage(
      "Your HER HEALTH guidance",
      "These symptoms do not automatically mean cancer. However, some cancers can cause symptoms like these, and other conditions can cause them too. This tool cannot estimate your cancer risk or provide a diagnosis.",
      advice
    );
  }

  function resetAssessment() {
    form.reset();
    result.replaceChildren();
    result.hidden = true;
  }

  form.addEventListener("submit", assessSymptoms);

  if (resetButton) {
    resetButton.addEventListener("click", resetAssessment);
  }

  console.log("HER HEALTH symptom guidance is ready.");
});
