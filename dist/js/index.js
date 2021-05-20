// The autoComplete.js Engine instance creator
const autoCompleteJS = new autoComplete({
  data: {
    src: async () => {
      // Loading placeholder text
      autoCompleteJS.input.setAttribute("placeholder", "Loading...");
      // Fetch External Data Source
      const source = await fetch("./db/generic.json");
      const data = await source.json();
      // Post Loading placeholder text
      autoCompleteJS.input.setAttribute("placeholder", autoCompleteJS.placeHolder);
      // Returns Fetched data
      return data;
    },
    key: ["food", "cities", "animals"],
    filter: (list) => {
      // Filter duplicates
      // incase of multiple data keys usage
      const filteredResults = Array.from(new Set(list.map((value) => value.match))).map((food) => {
        return list.find((value) => value.match === food);
      });

      return filteredResults;
    },
  },
  placeHolder: "Search for Food & Drinks!",
  resultsList: {
    container: (element, data) => {
      const info = document.createElement("p");
      if (data.results.length > 0) {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong`;
      }
      element.prepend(info);
    },
    noResults: true,
    maxResults: 15,
    tabSelect: true,
  },
  resultItem: {
    content: (element, data) => {
      // Modify Results Item Style
      element.style = "display: flex; justify-content: space-between;";
      // Modify Results Item Content
      element.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>
      <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
        ${data.key}
      </span>`;
    },
    highlight: {
      render: true,
    },
  },
  events: {
    input: {
      focus: () => autoCompleteJS.open(),
    },
  },
  onSelection: (dataFeedback) => {
    autoCompleteJS.input.blur();
    // Prepare User's Selected Value
    const selection = dataFeedback.selection.value[dataFeedback.selection.key];
    // Render selected choice to selection div
    document.querySelector(".selection").innerHTML = selection;
    // Replace Input value with the selected value
    autoCompleteJS.input.value = selection;
    // Console log autoComplete data feedback
    console.log(dataFeedback);
  },
});

// autoCompleteJS.input.addEventListener("init", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("response", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("results", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("open", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("navigate", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("close", function (event) {
//   console.log(event);
// });

// autoCompleteJS.input.addEventListener("unInit", function (event) {
//   console.log(event);
// });

// Toggle Search Engine Type/Mode
document.querySelector(".toggler").addEventListener("click", () => {
  // Holds the toggle button selection/alignment
  const toggle = document.querySelector(".toggle").style.justifyContent;

  if (toggle === "flex-start" || toggle === "") {
    // Set Search Engine mode to Loose
    document.querySelector(".toggle").style.justifyContent = "flex-end";
    document.querySelector(".toggler").innerHTML = "Loose";
    autoCompleteJS.searchEngine = "loose";
  } else {
    // Set Search Engine mode to Strict
    document.querySelector(".toggle").style.justifyContent = "flex-start";
    document.querySelector(".toggler").innerHTML = "Strict";
    autoCompleteJS.searchEngine = "strict";
  }
});

// Blur/unBlur page elements
const action = (action) => {
  const github = document.querySelector(".github-corner");
  const title = document.querySelector("h1");
  const mode = document.querySelector(".mode");
  const selection = document.querySelector(".selection");
  const footer = document.querySelector(".footer");

  if (action === "dim") {
    github.style.opacity = 1;
    title.style.opacity = 1;
    mode.style.opacity = 1;
    selection.style.opacity = 1;
    footer.style.opacity = 1;
  } else {
    github.style.opacity = 0.1;
    title.style.opacity = 0.3;
    mode.style.opacity = 0.2;
    selection.style.opacity = 0.1;
    footer.style.opacity = 0.1;
  }
};

// Blur/unBlur page elements on input focus
["focus", "blur"].forEach((eventType) => {
  autoCompleteJS.input.addEventListener(eventType, () => {
    // Blur page elements
    if (eventType === "blur") {
      action("dim");
    } else if (eventType === "focus") {
      // unBlur page elements
      action("light");
    }
  });
});
