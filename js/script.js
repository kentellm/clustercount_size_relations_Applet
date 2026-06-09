const nSlider = document.getElementById("nSlider");
const nInput  = document.getElementById("nInput");
const avgSlider = document.getElementById("avgSlider");
const avgInput  = document.getElementById("avgInput");
const output = document.getElementById("output");

// Generate X values for the plot (N from 1 to 30)
const xValues = Array.from({ length: 30 }, (_, i) => i + 1);

// Placeholder Y values (will update dynamically)
let yValues = xValues.map(x => 0);

// Chart.js setup
const ctx = document.getElementById("plotCanvas").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [
      {
        label: "ln(avg / N)",
        data: yValues,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        tension: 0
      },
      {
        label: "Current Value",
        data: [{ x: 1, y: 0 }],
        pointRadius: 6,
        pointBackgroundColor: "red",
        showLine: false
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "N" } },
      y: { title: { display: true, text: "ln(avg / N)" } }
    }
  }
});

function update() {
  const N = parseFloat(nInput.value);
  const avg = parseFloat(avgInput.value);

  if (N === 0 || avg <= 0) {
    output.textContent = "undefined";
    return;
  }

  const calcresult = avg / N;
  const result = Math.log(calcresult);
  output.textContent = result.toFixed(6);

  // Update full curve
  yValues = xValues.map(x => Math.log(avg / x));
  chart.data.datasets[0].data = yValues;

  // Update moving dot
  chart.data.datasets[1].data = [{ x: N, y: result }];

  chart.update();
}

// Sync sliders <-> inputs
nSlider.oninput = () => { nInput.value = nSlider.value; update(); };
nInput.oninput  = () => { nSlider.value = nInput.value; update(); };

avgSlider.oninput = () => { avgInput.value = avgSlider.value; update(); };
avgInput.oninput  = () => { avgSlider.value = avgInput.value; update(); };

update();
