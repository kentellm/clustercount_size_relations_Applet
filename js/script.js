const nSlider = document.getElementById("nSlider");
const nInput  = document.getElementById("nInput");
const avgSlider = document.getElementById("avgSlider");
const avgInput  = document.getElementById("avgInput");
const output = document.getElementById("output");

// Build grid for 3D surface
const N_vals = Array.from({ length: 30 }, (_, i) => i + 1);
const avg_vals = Array.from({ length: 30 }, (_, i) => (i + 1) * 10000);

function computeSurface() {
  const Z = [];
  for (let i = 0; i < avg_vals.length; i++) {
    const row = [];
    for (let j = 0; j < N_vals.length; j++) {
      row.push(Math.log(avg_vals[i] / N_vals[j]));
    }
    Z.push(row);
  }
  return Z;
}

const Z_surface = computeSurface();

// Initial moving point
let pointTrace = {
  x: [5],
  y: [10000],
  z: [Math.log(10000 / 5)],
  mode: "markers",
  marker: { size: 6, color: "red" },
  type: "scatter3d"
};

// Surface trace
let surfaceTrace = {
  x: N_vals,
  y: avg_vals,
  z: Z_surface,
  type: "surface",
  colorscale: "Viridis",
  opacity: 0.9
};

// Compute the contour line where ln(A/N) = 7.1
const targetZ = 7.1;
const expVal = Math.exp(targetZ);  // ≈ 1210.286

const contourX = N_vals;
const contourY = N_vals.map(n => n * expVal);
const contourZ = N_vals.map(() => targetZ);

let contourTrace = {
  x: contourX,
  y: contourY,
  z: contourZ,
  mode: "lines",
  line: {
    color: "red",
    width: 6
  },
  name: "ln(A/N) = 7.1",
  type: "scatter3d"
};

Plotly.newPlot("plot3d", [surfaceTrace, pointTrace, contourTrace], {
  scene: {
    xaxis: { title: "N" },
    yaxis: { title: "Average Size" },
    zaxis: { title: "ln(avg / N)" }
  }
});

function update() {
  const N = parseFloat(nInput.value);
  const avg = parseFloat(avgInput.value);

  if (N <= 0 || avg <= 0) {
    output.textContent = "undefined";
    return;
  }

  const result = Math.log(avg / N);
  output.textContent = result.toFixed(6);

  // Update moving point
  Plotly.update("plot3d", {
    x: [[N]],
    y: [[avg]],
    z: [[result]]
  }, {}, [1]);
}

// Sync sliders <-> inputs
nSlider.oninput = () => { nInput.value = nSlider.value; update(); };
nInput.oninput  = () => { nSlider.value = nInput.value; update(); };

avgSlider.oninput = () => { avgInput.value = avgSlider.value; update(); };
avgInput.oninput  = () => { avgSlider.value = avgInput.value; update(); };

update();
