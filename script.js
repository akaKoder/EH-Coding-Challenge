const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const totalColors = 32768;
const step = Math.round(Math.cbrt(totalColors));

let colors = [];

// creates the colors
for (let r = 0; r < step; r++) {
  for (let g = 0; g < step; g++) {
    for (let b = 0; b < step; b++) {
      const red = Math.floor((r / step) * 256);
      const green = Math.floor((g / step) * 256);
      const blue = Math.floor((b / step) * 256);
      colors.push(`rgb(${red},${green},${blue})`);
    }
  }
}

function drawColors(colors) {
  const blockSize = Math.ceil(Math.sqrt(canvas.width * canvas.height / totalColors));
  let x = 0;
  let y = 0;

  colors.forEach(color => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
    x += blockSize;
    if (x >= canvas.width) {
      x = 0;
      y += blockSize;
    }
  });
}

function sortColors(sortFunction) {
  colors.sort((a, b) => {
    const colorA = a.match(/\d+/g).map(Number);
    const colorB = b.match(/\d+/g).map(Number);
    return sortFunction(colorA, colorB);
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawColors(colors);
}

document.getElementById('sortHue').onclick = () => sortColors((a, b) => rgbToHsl(...a)[0] - rgbToHsl(...b)[0]);
document.getElementById('sortSaturation').onclick = () => sortColors((a, b) => rgbToHsl(...a)[1] - rgbToHsl(...b)[1]);
document.getElementById('sortLightness').onclick = () => sortColors((a, b) => rgbToHsl(...a)[2] - rgbToHsl(...b)[2]);

drawColors(colors);

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}


// hilbert curve, with a deeper breakdown on its workings in the readme...

function hilbert(index, n, dir, shift) {
  if (n === 0) {
    return [0, 0];
  }

  const half = 1 << (n - 1);
  const quarter = half >> 1;
  const mask = half - 1;

  let rx = (index >>> shift) & 1;
  let ry = (index >>> (shift - 1)) & 1;

  if (dir !== 0) {
    if (rx === ry) {
      rx = 1 - rx;
      ry = 1 - ry;
    }

    ry = ry ^ rx;
  }

  const [x, y] = hilbert(index, n - 1, dir ^ 1, shift - 2);

  return [
    ry === 0 ? y : x,
    ry === 0 ? (rx === 0 ? x : mask - x) : (rx !== 0 ? y + half : half - 1 - y),
  ];
}

function drawHilbert() {
  const blockSize = Math.ceil(Math.sqrt(canvas.width * canvas.height / totalColors));

  for (let i = 0; i < totalColors; i++) {
    const [x, y] = hilbert(i, 9, 0, 16);
    ctx.fillStyle = colors[i];
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  }
}

document.getElementById('sortHilbert').onclick = drawHilbert;

//redraw canvas on resize
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawColors(colors);
});

// replaces 'canvas' with 'wrapper' in the fullscreen event listener
document.getElementById('fullscreen').addEventListener('click', function() {
  const wrapper = document.getElementById('wrapper');

  if (wrapper.requestFullscreen) {
    wrapper.requestFullscreen();
  } else if (wrapper.mozRequestFullScreen) { // Firefox
    wrapper.mozRequestFullScreen();
  } else if (wrapper.webkitRequestFullscreen) { // Chrome, Safari and Opera
    wrapper.webkitRequestFullscreen();
  } else if (wrapper.msRequestFullscreen) { // IE/Edge
    wrapper.msRequestFullscreen();
  }
});

// redraws on resize
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawColors(colors);
});


// adds new button handlers
document.getElementById('sortRGB').onclick = () => sortColors((a, b) => rgbToInt(...a) - rgbToInt(...b));
document.getElementById('sortBrightness').onclick = () => sortColors((a, b) => perceivedBrightness(...a) - perceivedBrightness(...b));
document.getElementById('sortInvHilbert').onclick = () => {
  colors = colors.reverse();
  drawHilbert();
};

// adds new sorting functions
function rgbToInt(r, g, b) {
  return ((r << 16) | (g << 8) | b);
}

function perceivedBrightness(r, g, b) {
  // Perceived brightness formula from https://www.w3.org/TR/AERT/#color-contrast
  return (r * 299 + g * 587 + b * 114) / 1000;
}
