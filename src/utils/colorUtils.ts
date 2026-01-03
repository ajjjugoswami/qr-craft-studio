/**
 * Color utility functions
 */

/**
 * Converts HSL color string to RGB format
 * @param hsl - HSL color string in format "h s% l%" (e.g., "220 70% 50%")
 * @returns RGB color string in format "rgb(r, g, b)"
 */
export const hslToRgb = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map((v, i) => 
    i === 0 ? parseInt(v) : parseInt(v.replace('%', ''))
  );
  
  const a = s * Math.min(l, 100 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color / 100);
  };
  
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
};

/**
 * Converts HSL color string to hex format
 * @param hsl - HSL color string in format "h s% l%" (e.g., "220 70% 50%")
 * @returns Hex color string in format "#rrggbb"
 */
export const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map((v, i) => 
    i === 0 ? parseInt(v) : parseInt(v.replace('%', ''))
  );
  
  const a = s * Math.min(l, 100 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const value = Math.round(255 * color / 100);
    return value.toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Converts RGB values to hex format
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string in format "#rrggbb"
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Converts hex color to RGB values
 * @param hex - Hex color string (with or without #)
 * @returns Object with r, g, b values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Adjusts the lightness of an HSL color
 * @param hsl - HSL color string in format "h s% l%"
 * @param adjustment - Lightness adjustment (-100 to 100)
 * @returns Adjusted HSL color string
 */
export const adjustHslLightness = (hsl: string, adjustment: number): string => {
  const [h, s, l] = hsl.split(' ').map((v, i) => 
    i === 0 ? parseInt(v) : parseInt(v.replace('%', ''))
  );
  
  const newL = Math.max(0, Math.min(100, l + adjustment));
  return `${h} ${s}% ${newL}%`;
};

/**
 * Creates an alpha version of an RGB color
 * @param rgb - RGB color string in format "rgb(r, g, b)"
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export const addAlphaToRgb = (rgb: string, alpha: number): string => {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
};