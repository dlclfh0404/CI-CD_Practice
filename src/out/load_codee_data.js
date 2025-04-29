function extractTableData(objects, hasFoot = false) {
  if (objects.length === 0) {
    return [[],  [], []];
  }
  const data = objects.map(object => Object.values(object));
  const bodyData = hasFoot ? data.slice(0, -1) : data;
  const footData = hasFoot ? data.slice(-1)[0] : [];
  return [ Object.keys(objects[0]), bodyData, footData ];
}

// TODO: As a first and quick approach to visualize all codee reported
// tables in a web browser, we use these JS functions to generate the same
// HTML structure for all of them directly from the JSON. At the moment all
// tables have the same form, however, in the future, we would have
// different kind of reports that probably need a specific HTML template.
// Ideally, we should use JS just to fill the content, not to build the
// layout.

// Create and fill the table heading
function createTableHead(data) {
  if (data.length === 0) {
    return null;
  }
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  data.forEach(value => {
    const th = document.createElement("th");
    th.textContent = value;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  return thead;
}

// Create and fill the table body
function createTableBody(data) {
  if (data.length === 0) {
    return null;
  }
  const tbody = document.createElement("tbody");
  data.forEach(item => {
    const tr = document.createElement("tr");
    item.forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  return tbody;
}

// Create and fill the table foot
function createTableFoot(data) {
  if (data.length === 0) {
    return null;
  }
  const tfoot = document.createElement("tfoot");
  const tr = document.createElement("tr");
  data.forEach(value => {
    const th = document.createElement("th");
    th.textContent = value;
    tr.appendChild(th);
  });
  tfoot.appendChild(tr);
  return tfoot;
}

// Create a fill a table with the given data
function createTable(head, body, foot) {
  const table = document.createElement("table");
  const tableElements =
      [ createTableHead(head), createTableBody(body), createTableFoot(foot) ];
  tableElements.forEach(element => {
    if (element) {
      table.appendChild(element);
    }
  });

  return table;
}

// The incoming '<td>' contains the Level (L1, L2 or L3) of a Check, and its
// previous sibling is its corresponding CheckID to which we want to apply
// styles. So replace the text with a stylized link.
function addStyleToCheckId(td, className) {
  const prev = td.previousSibling?.previousSibling;
  if (!prev) {
    return;
  }

  // Save the check value to move into the <a>
  const checkId = prev.textContent;

  // Create an stylized link and replace the old <td> content
  const a = document.createElement("a");
  a.className = className;
  a.href =
      "https://github.com/codee-com/open-catalog/tree/main/Checks/" + checkId;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = checkId;
  prev.textContent = "";
  prev.appendChild(a);
}

// Apply a style to the fields of the Ranking Breakdown table that contains the
// CheckID.
// TODO: This is a workaround because it only applies for tables where the
// CheckID is in the column just to the left of the Priority/Level column. It
// would be nice to have a way to apply it globally.
function setCheckerClassInRanking(elementId) {
  const ranking = document.getElementById(elementId);
  if (!ranking) {
    return;
  }
  for (const td of ranking.querySelectorAll("td")) {
    if (td.textContent.includes("(L1)")) {
      addStyleToCheckId(td, "checker-level-1");
    } else if (td.textContent.includes("(L2)")) {
      addStyleToCheckId(td, "checker-level-2");
    } else if (td.textContent.includes("(L3)")) {
      addStyleToCheckId(td, "checker-level-3");
    }
  }
}

// Set the banner title with the report title
function fillBannerTitle(title) {
  const reportTitle = document.getElementById("report-title");
  reportTitle.textContent = title;
}

// Create an article element containing a report table
function createArticle(articleData) {
  const article = document.createElement("article");
  article.setAttribute("id", articleData.id);

  const reportTableDiv = document.createElement("div");
  reportTableDiv.className = "report-table";

  const tableHeader = document.createElement("header");
  const tableHeaderTitle = document.createElement("h1");
  tableHeaderTitle.textContent = articleData.title;
  tableHeader.appendChild(tableHeaderTitle);

  reportTableDiv.appendChild(tableHeader);

  articleData.content.forEach(item => { reportTableDiv.appendChild(item); });
  article.appendChild(reportTableDiv);

  return article;
}

// Create a section which may contain multiple articles.
// TODO: At the moment we are creating one row just with one column for each
// section. It would be nice to have a declarative description of the
// distribution accross rows and cols we want for all reports widgets in a view.
function createSection(sectionData) {
  const section = document.createElement("section");
  section.setAttribute("id", sectionData.id);

  // Add a header with the section title
  const header = document.createElement("header");
  const h1 = document.createElement("h1");
  h1.textContent = sectionData.title;
  header.appendChild(h1);
  section.appendChild(header);

  // Create the section layout for this section. For now, just one column for
  // each one.
  const sectionRow = document.createElement("div");
  sectionRow.className = "row";
  section.appendChild(sectionRow);

  const sectionCol = document.createElement("div");
  sectionCol.className = "col";
  sectionRow.appendChild(sectionCol);

  // Create and append the section articles
  sectionData.articles.forEach(
      article => { sectionCol.appendChild(createArticle(article)); });

  return section;
}

// Create the main element where all sections live
function createMain(sections) {
  const main = document.getElementById("main-report");
  sections.forEach(section => { main.appendChild(createSection(section)); });
}

// Generate the whole report
function createReport(report) {
  document.title = report.title;

  fillBannerTitle(report.title);
  createMain(report.sections);
  setCheckerClassInRanking("qualityRank__breakdown");
  setCheckerClassInRanking("optimizationRank__breakdown");
}

// Load the report data from the server with an HTTP request and generate
// the content
async function load() {
  let data;
  try {
    const response = await fetch("report.json");
    data = await response.json();
  } catch (error) {
    const error_paragraph = document.createElement("p");
    error_paragraph.textContent =
        "The Codee reported data file could not be found at './report.json'",
    error_paragraph.className = "text-error";
    document.body.appendChild(error_paragraph);
    return;
  }

  // TODO: These tables only belong to the Screening report. We should iterate
  // over the JSON entries filling the whole map dinamically.
  // As a workaround, we could handle here all the codee tables that codee can
  // report and print them all. If a table does not have content, then do not
  // create its section

  const [langHead, langBody, langFoot] =
      extractTableData(data["Language summary"]);
  const [coverageHead, coverageBody, coverageFoot] =
      extractTableData(data["Analysis Coverage"]);

  // Screening report is optional, it depends on --verbose flag
  const [screeningHead, screeningBody, screeningFoot] =
      data.hasOwnProperty("Screening summary")
          ? extractTableData(data["Screening summary"], true)
          : [ [], [], [] ];
  const qualityRankData = data.hasOwnProperty("Ranking of Quality Checkers")
          ? data["Ranking of Quality Checkers"] : [];
  const optimizationRankData = data.hasOwnProperty("Ranking of Optimization Checkers")
          ? data["Ranking of Optimization Checkers"] : [];
  const [qualityRankHead, qualityRankBody, qualityRankFoot] =
      extractTableData(qualityRankData, true);
  const [optimizationRankHead, optimizationRankBody, optimizationRankFoot] =
      extractTableData(optimizationRankData, true);

  const langTable = createTable(langHead, langBody, langFoot);
  const coverageTable = createTable(coverageHead, coverageBody, coverageFoot);
  const screeningTable =
      createTable(screeningHead, screeningBody, screeningFoot);
  const qualityRankTable = qualityRankHead.length > 0 ?
      createTable(qualityRankHead, qualityRankBody, qualityRankFoot) : null;
  const optimizationTable = optimizationRankHead.length > 0 ?
      createTable(optimizationRankHead, optimizationRankBody, optimizationRankFoot) : null;

  // TODO:: Sections are an arbitrary way to place reports. We could use
  // one section for each row, and one table for each column in the row.
  // Or create another semantic element to configure rows and columns for each
  // table or report.
  //
  // TODO: Having a kind of config where we can define the different views, like
  // report distributions, sizes, views could be nice.
  //
  // TODO: Define here all tables which we want to generate its HTML. I think
  // the json generated by codee should include at least an ID for each table so
  // that we can reference it here easily. Also, we could embed some information
  // like the kind of each report or the type of each column (filepath, number,
  // text...) so that we could set different styles (font, color...) to each
  // field in the table.
  const sections = [
    {
      id : "summary",
      title : "Summary",
      articles : [
        {
          id : "summary__language_breakdown",
          title : "Language breakdown",
          content : [ langTable ]
        },
        ]
      },
    {
      id : "analysis_coverage",
      articles : [
        {
          id : "analysis_coverage_table",
          title : "Analysis Coverage",
          content : [ coverageTable ]
        },
        ]
    },
  ];

  if (qualityRankTable) {
    sections[1].articles.push( {
        id : "qualityRank__breakdown",
        title : "Ranking of Quality Checkers",
        content: [ qualityRankTable ]
    });
  }

  if (optimizationTable) {
    sections[1].articles.push( {
        id : "optimizationRank__breakdown",
        title : "Ranking of Optimization Checkers",
        content : [ optimizationTable ]
    });
  }

  sections[1].articles.push( {
      id : "summary__screening_breakdown",
      title : "Screening breakdown",
      content : [ screeningTable ]
  });

  createReport({
    title : "Screening report",
    sections : sections
  });
}

load();
