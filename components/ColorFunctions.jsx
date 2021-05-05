function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function calcRelativeLumino(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const srgb = result
    .filter((elt, index) => index !== 0)
    .map((elt) => parseInt(elt, 16) / 255);

  //if sRGB <= 0.03928 then RGB = sRGB/12.92 else RGB = ((sRGB+0.055)/1.055) ^ 2.4
  const rgb = srgb.map((elt) =>
    elt <= 0.03928 ? elt / 12.92 : ((elt + 0.055) / 1.055) ** 2.4
  );

  //L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

  return L;
}

export function isWhiteAccessible(hex) {
  const ratio = 1.05 / (calcRelativeLumino(hex) + 0.05);
  return ratio >= 3 ? true : false;
}

export function hexToLightHex(hex, per) {
  const p = per;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    r: Math.floor(
      parseInt(result[1], 16) + p * (255 - parseInt(result[1], 16))
    ),
    g: Math.floor(
      parseInt(result[2], 16) + p * (255 - parseInt(result[2], 16))
    ),
    b: Math.floor(
      parseInt(result[3], 16) + p * (255 - parseInt(result[3], 16))
    ),
  };
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
}

export function hexToDimHex(hex, per) {
  const p = per;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    r: Math.floor(parseInt(result[1], 16) - p * parseInt(result[1], 16)),
    g: Math.floor(parseInt(result[2], 16) - p * parseInt(result[2], 16)),
    b: Math.floor(parseInt(result[3], 16) - p * parseInt(result[3], 16)),
  };
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
}
