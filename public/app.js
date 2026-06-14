const btnStatus = document.getElementById("btnStatus");
const btnLoad = document.getElementById("btnLoad");

const statusLight = document.getElementById("statusLight");
const statusText = document.getElementById("statusText");
const instanceText = document.getElementById("instanceText");

const totalRequests = document.getElementById("totalRequests");
const loadRequests = document.getElementById("loadRequests");
const durationText = document.getElementById("durationText");
const testStatus = document.getElementById("testStatus");
const output = document.getElementById("output");

function showOutput(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

async function checkStatus() {
  try {
    testStatus.textContent = "Checking";
    btnStatus.disabled = true;

    const response = await fetch("/api/status");
    const data = await response.json();

    statusLight.className = "light running";
    statusText.textContent = "Server Running";
    instanceText.textContent = `Instance: ${data.instanceId}`;
    testStatus.textContent = "Server OK";

    showOutput({
      action: "Cek Server",
      result: data
    });

    await loadMetrics();
  } catch (error) {
    statusLight.className = "light error";
    statusText.textContent = "Server Error";
    testStatus.textContent = "Error";

    showOutput({
      status: "error",
      message: "Server tidak bisa diakses",
      error: error.message
    });
  } finally {
    btnStatus.disabled = false;
  }
}

async function runLoadTest() {
  try {
    btnStatus.disabled = true;
    btnLoad.disabled = true;

    testStatus.textContent = "Running";
    durationText.textContent = "0s";
    output.textContent = "Mengirim 50 request ke server...";

    const start = performance.now();

    const requests = [];

    for (let i = 0; i < 50; i++) {
      requests.push(fetch("/api/load").then((res) => res.json()));
    }

    const results = await Promise.all(requests);

    const end = performance.now();
    const duration = ((end - start) / 1000).toFixed(2);

    durationText.textContent = `${duration}s`;
    testStatus.textContent = "Selesai";

    showOutput({
      action: "Simulasi 50 Request",
      status: "completed",
      totalRequestSent: results.length,
      duration: `${duration}s`,
      sampleResponse: results[0]
    });

    await loadMetrics();
  } catch (error) {
    testStatus.textContent = "Gagal";

    showOutput({
      status: "error",
      message: "Simulasi request gagal",
      error: error.message
    });
  } finally {
    btnStatus.disabled = false;
    btnLoad.disabled = false;
  }
}

async function loadMetrics() {
  const response = await fetch("/api/metrics");
  const data = await response.json();

  totalRequests.textContent = data.totalRequests;
  loadRequests.textContent = data.loadRequests;

  return data;
}

btnStatus.addEventListener("click", checkStatus);
btnLoad.addEventListener("click", runLoadTest);

checkStatus();