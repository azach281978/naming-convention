function generateName() {
  const env = document.getElementById("environment").value;
  const workloadInput = document.getElementById("workload").value;
  const resource = document.getElementById("resource").value;
  const instanceCountInput = document.getElementById("instanceCount").value;

  const errors = [];
  const errorsDiv = document.getElementById("errors");
  const resultSpan = document.getElementById("result");

  resultSpan.innerHTML = "";
  errorsDiv.innerHTML = "";

  if (!env) {
    errors.push("Environment is required.");
  }

  if (!workloadInput || !workloadInput.trim()) {
    errors.push("Workload is required.");
  }

  if (!resource) {
    errors.push("Resource type is required.");
  }

  if (!instanceCountInput || !instanceCountInput.trim()) {
    errors.push("Number of instances is required.");
  }

  const count = parseInt(instanceCountInput, 10);
  if (!isNaN(count)) {
    if (count < 1) {
      errors.push("Number of instances must be at least 1.");
    } else if (count > 99) {
      errors.push("Number of instances must be less than 100.");
    }
  } else {
    errors.push("Number of instances must be a valid number.");
  }

  if (errors.length > 0) {
    errorsDiv.innerHTML = errors.join("<br>");
    return;
  }

  const envLower = env.toLowerCase();
  const workload = workloadInput.toLowerCase().replace(/\s+/g, "");
  const names = [];

  // Subscription: PRD-INT-IT
  if (resource === "subscription") {
    const parts = workloadInput.replace(/\s+/g, "").toUpperCase().split("-");
    if (parts.length < 2) {
      errorsDiv.innerHTML = 'For Subscription, enter workload as "INT-IT" (internal/external-business unit).';
      return;
    }
    const scope = parts[0];
    const bu = parts[1];
    const name = env.toUpperCase() + "-" + scope + "-" + bu;
    names.push(name);
  }

  // Resource Group: prd-int-it-rg-network
  else if (resource === "rg") {
    const parts = workloadInput.toLowerCase().replace(/\s+/g, "").split("-");
    if (parts.length < 3) {
      errorsDiv.innerHTML = 'For Resource Group, enter workload as "int-it-network" (internal/external-business unit-function).';
      return;
    }
    const scope = parts[0];
    const bu = parts[1];
    const func = parts.slice(2).join("-");
    const name = envLower + "-" + scope + "-" + bu + "-rg-" + func;
    names.push(name);
  }

  // Regular resources (including special cases)
  else {
    for (let i = 1; i <= count; i++) {
      const instance = String(i).padStart(2, "0");
      let name = "";

      // Storage Account: prdsynapseblob01
      if (resource === "sa") {
        name = envLower + workload + "blob" + instance;
      }

      // Network Watcher: NetworkWatcher_canadacentral
      else if (resource === "networkwatcher") {
        name = "NetworkWatcher_canadacentral";
      }

      // Private DNS zone: privatelink.database.windows.net
      else if (resource === "privatedns") {
        name = "privatelink.database.windows.net";
      }

      // Azure Arc Server: pidc-e01 (server name)
      else if (resource === "arcserver") {
        name = workload;
      }

      // VM image definition: dev-avd-computegallery-01
      else if (resource === "vmimage") {
        name = envLower + workload + "computegallery" + instance;
      }

      // VM image version: 1.0.0
      else if (resource === "imageversion") {
        name = "1.0.0";
      }

      // Workbook / ACR: GUID
      else if (resource === "workbook" || resource === "acr") {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          name = crypto.randomUUID();
        } else {
          name = envLower + workload + resource + instance;
        }
      }

      // B2C tenant:
      else if (resource === "b2c") {
        name = workload + ".onmicrosoft.com";
      }

      // Image: win11-24h2-avd-m365-01 etc (workload carries full pattern)
      else if (resource === "image") {
        name = workload + "-" + instance;
      }

      // AVD host pool: dev-avd-persistentpool-01
      else if (resource === "hp") {
        name = envLower + "-" + workload + "-persistentpool-" + instance;
      }

      // AVD workspace: dev-avd-workspace-01
      else if (resource === "workspace") {
        name = envLower + "-" + workload + "-workspace-" + instance;
      }

      // Default pattern with mapped segments
      else {
        let segment = resource;

        if (resource === "gallery") {
          segment = "computegallery";
        } else if (resource === "cosmos") {
          segment = "cosmosdb";
        } else if (resource === "adx") {
          segment = "dataexplorer";
        } else if (resource === "devops") {
          segment = "group";
        } else if (resource === "ml") {
          segment = "machinelearning";
        } else if (resource === "cv") {
          segment = "computervision";
        } else if (resource === "aci") {
          segment = "container";
        } else if (resource === "fa") {
          segment = "function";
        } else if (resource === "iothub") {
          segment = "hub";
        } else if (resource === "lb") {
          segment = "loadbalancer";
        } else if (resource === "logquery") {
          segment = "querypack";
        } else if (resource === "law") {
          segment = "log";
        } else if (resource === "nsgflow") {
          segment = "flowlog";
        } else if (resource === "restore") {
          segment = "backup";
        } else if (resource === "shc") {
          segment = "sserviceshubconnector";
        } else if (resource === "sql") {
          segment = "db";
        } else if (resource === "sqlsrv") {
          segment = "sql";
        } else if (resource === "sqlvm") {
          segment = "vm";
        } else if (resource === "swa") {
          segment = "staticwebapp";
        } else if (resource === "tsi") {
          segment = "timeseriesinsights";
        } else if (resource === "tsisource") {
          segment = "eventsource";
        } else if (resource === "tm") {
          segment = "trafficmanager";
        } else if (resource === "solution") {
          segment = "snapshotinsights";
        }

        name = envLower + "-" + workload + "-" + segment + "-" + instance;
      }

      names.push(name);
    }
  }

  resultSpan.innerHTML = names.join("<br>");
}

function copyName() {
  const resultSpan = document.getElementById("result");
  const text = resultSpan.innerHTML.replace(/<br\s*\/?>/gi, "\n").trim();
  if (!text) {
    return;
  }
  navigator.clipboard.writeText(text);
}
