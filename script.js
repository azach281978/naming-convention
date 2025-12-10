function generateName() {
  const env = document.getElementById("environment").value.toLowerCase();
  const workload = document.getElementById("workload").value.toLowerCase().replace(/\s+/g, '');
  const resource = document.getElementById("resource").value;
  const instance = document.getElementById("instance").value;

  let name = "";

  //-------------------------------------------------------
  // SPECIAL NAMING RULES FROM CITY OF CALGARY DOCUMENT
  //-------------------------------------------------------

  // 1. STORAGE ACCOUNT — no hyphens, concatenated
  if (resource === "sa") {
    name = `${env}${workload}blob${instance}`;
  }

  // 2. NETWORK WATCHER — Microsoft enforced naming
  else if (resource === "networkwatcher") {
    name = "NetworkWatcher_canadacentral"; // per doc
  }

  // 3. PRIVATE DNS ZONE — uses FQDN directly
  else if (resource === "privatedns") {
    name = "privatelink.database.windows.net";
  }

  // 4. SERVER - AZURE ARC — uses server name only
  else if (resource === "arcserver") {
    name = workload; // document uses pidc-e01 style
  }

  // 5. VM IMAGE DEFINITION — environment + workload + gallery name
  else if (resource === "image") {
    name = `${env}${workload}computegallery${instance}`;
  }

  // 6. VM IMAGE VERSION — semantic version only
  else if (resource === "imageversion") {
    name = "1.0.0";
  }

  // 7. GUID-BASED RESOURCES
  else if (resource === "workbook" || resource === "acr") {
    name = crypto.randomUUID();
  }

  // 8. B2C TENANT
  else if (resource === "b2c") {
    name = `${workload}.onmicrosoft.com`;
  }

  //-------------------------------------------------------
  // DEFAULT NAMING PATTERN (MOST RESOURCES USE THIS)
  //-------------------------------------------------------
  else {
    name = `${env}-${workload}-${resource}-${instance}`;
  }

  document.getElementById("result").textContent = name;
}
