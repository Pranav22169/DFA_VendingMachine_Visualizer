const transitions = {
  start: { 5: "rs5", 10: "rs10" },
  rs5: { 5: "rs10", 10: "rs15" },
  rs10: { 5: "rs15", 10: "rs20" },
  rs15: { 5: "rs20", 10: "rs25" },
  rs20: { 5: "rs25", 10: "rs25" },
  rs25: { 5: "rs25", 10: "rs25" },
};

function drawArrow(svg, x1, y1, x2, y2) {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
  arrow.setAttribute("x1", x1);
  arrow.setAttribute("y1", y1);
  arrow.setAttribute("x2", x2);
  arrow.setAttribute("y2", y2);
  arrow.setAttribute("stroke", "#5d5e5e");
  arrow.setAttribute("stroke-width", "1.5");
  arrow.setAttribute("marker-end", "url(#arrow)");
  svg.appendChild(arrow);
}

//   function drawCurvedLine(svg, startX, startY, endX, endY, controlX, controlY) {
//     const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
//     const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
//     curve.setAttribute("d", d);
//     curve.setAttribute("stroke", "black");
//     curve.setAttribute("fill", "transparent");
//     svg.appendChild(curve);
//   }
function drawCurvedLine(svg, startX, startY, endX, endY, controlX, controlY) {
  const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
  curve.setAttribute("d", d);
  curve.setAttribute("stroke", "#5d5e5e");
  curve.setAttribute("stroke-width", "1.5"); // Increase stroke width for bolder curved lines
  curve.setAttribute("fill", "transparent");
  curve.setAttribute("marker-end", "url(#arrow)"); // Add arrowhead to the end of the curved line
  svg.appendChild(curve);
}

window.onload = function () {
  const svg = document.querySelector("svg");

  // Draw arrows
  drawArrow(svg, 210, 205, 333, 205); // start to pen
  drawArrow(svg, 434, 205, 555, 205); // pen to copy
  drawArrow(svg, 45, 205, 108, 205); // to start
  drawArrow(svg, 336, 227, 178, 343); // rs5 to rs15
  drawArrow(svg, 560, 225, 200, 359); // rs10 to rs15
  drawArrow(svg, 210, 392, 332, 392); // rs10 to rs20
  drawArrow(svg, 435, 392, 556, 392); // rs15 to rs20
  drawArrow(svg, 567, 237, 419, 352); // rs15 to rs25
  // drawArrow(svg, 900, 40, 1000, 40); // rs20 to rs25
  drawCurvedLine(svg, 159, 157, 600, 157, 384, 10); // rs20 to rs25 curved
  drawCurvedLine(svg, 156, 442, 577, 432, 390, 550); // rs20 to rs25 curved
  // drawArrow(svg, 950, 40, 950, 0); // rs25 to rs25
  // drawArrow(svg, 950, 90, 950, 140); // rs25 to rs25

  // Define arrowhead marker
  const marker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "marker"
  );
  marker.setAttribute("id", "arrow");
  marker.setAttribute("markerWidth", "10");
  marker.setAttribute("markerHeight", "10");
  marker.setAttribute("refX", "8");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const arrowPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  arrowPath.setAttribute("d", "M0,0 L0,6 L9,3 z");
  arrowPath.setAttribute("fill", "#5d5e5e");
  marker.appendChild(arrowPath);
  svg.appendChild(marker);
};

const price = {
  rs5: { rate: 5 },
  rs10: { rate: 10 },
  rs15: { rate: 15 },
  rs20: { rate: 20 },
  rs25: { rate: 25 },
};
// console.log (price["pen"].rate)
async function checkTransaction(product, id) {
  let token5 = parseInt(document.getElementById("token5").value);
  // console.log(token5)
  let token10 = parseInt(document.getElementById("token10").value);

  let sum = token5 * 5 + 10 * token10;
  // console.log(sum)

  document.querySelector(`#${id} > .product`).style.background = "gray";

  // const product = document.getElementById("product").value;
  console.log(price[product].rate);
  const tem = Math.floor(price[product].rate / 10); // tem will be 2
  const resultElement = document.getElementById("result");  

  // Reset all state colors
  const allStates = document.querySelectorAll(".state");
  allStates.forEach((state) => {
    state.style.backgroundColor = "";
  });

  let currentState = "start";
  const need10 = Math.min(tem, token10);

  for (let i = 0; i < need10; i++) {
    const nextState = transitions[currentState]["10"];
    const currentStateElement = document.getElementById(currentState);
    currentStateElement.style.backgroundColor = "#8a4f03"; // Highlight current state
    await sleep(1000); // Delay for visualization
    currentStateElement.style.backgroundColor = ""; // Remove highlight
    currentState = nextState;
    sum = sum - 10;
    // if(sum ==0 ) break;
    if (currentState === product) {
      token5 = 0;
      break;
    }
  }

  for (let i = 0; i < token5; i++) {
    const nextState = transitions[currentState]["5"];
    const currentStateElement = document.getElementById(currentState);
    currentStateElement.style.backgroundColor = "#8a4f03"; // Highlight current state
    await sleep(1000); // Delay for visualization
    currentStateElement.style.backgroundColor = ""; // Remove highlight

    currentState = nextState;
    if (currentState === product) break;
  }

  const finalStateElement = document.getElementById(currentState);
  finalStateElement.style.backgroundColor = "#00ff44"; // Highlight final state
  await sleep(1000); // Delay for visualization
  let remAmt = sum;
  if (currentState === product) {
    resultElement.textContent = "Transaction successful";
    setTimeout(() => {
      document.querySelector(`#${id} > .product`).style.background = "";
    }, 2000);
    currentStateElement.style.backgroundColor = "";
  } else {
    resultElement.textContent = "Transaction failed";
    finalStateElement.style.backgroundColor = "red";
    setTimeout(() => {
      document.querySelector(`#${id} > .product`).style.background = "";
    }, 2000);
    
  }
  if (remAmt > 0) {
    let token5 = parseInt(document.getElementById("token5").value);
    token5.innerText = parseInt(remAmt / 5);
    console.log(remAmt);
  }
}

function reset() {
  document.getElementById("token5").value = 0;
  document.getElementById("token10").value = 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
