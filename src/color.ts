const hexadecimalRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const canTransformToThreeDightHexadacimalRegex = /#(?:([0-9a-f])\1){3}/i;

const functionalColorRegex = /((?:RGBA)|(?:RGB)|(?:HSL))\((?:\s*([\d\.%]+)\s*,\s*([\d\.%]+)\s*,\s*([\d\.%]+)\s*(?:,\s*([\d\.%]+)\s*)?)\)/i;

const RGBAVectorTokenRegex = /((?:\d+)|(?:\d*\.\d+))(%)?/;
const HueVectorTokenRegex = /\d+/;
const SaturationLightnessVectorTokenRegex = /(\d+)%/;
export const keyword2HexadecimalMap: { [key: string]: string } = {
  // https://www.w3.org/TR/2018/REC-css-color-3-20180619/#colorunits
  // Basic color keywords
  black: '#000000',
  silver: '#C0C0C0',
  gray: '#808080',
  white: '#FFFFFF',
  maroon: '#800000',
  red: '#FF0000',
  purple: '#800080',
  fuchsia: '#FF00FF',
  green: '#008000',
  lime: '#00FF00',
  olive: '#808000',
  yellow: '#FFFF00',
  navy: '#000080',
  blue: '#0000FF',
  teal: '#008080',
  aqua: '#00FFFF'

  // TODO: add extended color keywords
};

export function RGB2HSL(red: number, green: number, blue: number) {
  const [max, min] = [red / 256, green / 256, blue / 256].reduce(
    ([prevMax, prevMin], current: number): [number, number] =>
      [
        Math.max(prevMax, current),
        Math.min(prevMin, current)
      ],
    [0, 1]);
  const lightness = (max + min) / 2;
  const delta = (max - min);
  let hue = 0, saturation = 0;

  switch (max) {
    case min:
      hue = 0;
      break;
    case red:
      hue = 60 * ((green - blue) / delta) + (green >= blue ? 0 : 360);
      break;
    case green:
      hue = 60 * ((blue - red) / delta) + 120;
      break;
    case blue:
      hue = 60 * ((red - green) / delta) + 240;
      break;
  }

  if (lightness === 0 || max === min) {
    saturation = 0;
  } else if (0 < lightness && lightness <= 1 / 2) {
    saturation = delta / (2 * lightness);
  } else if (lightness > 1 / 2) {
    saturation = delta / (2 - 2 * lightness);
  }

  return [hue, saturation, lightness];
}

export function HSL2RGB(hue: number, saturation: number, lightness: number) {
  if (saturation === 0) {
    return [lightness, lightness, lightness];
  }

  const q = lightness < 1 / 2 ?
    lightness * (1 + saturation) :
    lightness + saturation - (lightness * saturation);
  const p = 2 * lightness - q;
  const hk = hue / 360;
  return [
    hk + 1 / 3,
    hk,
    hk - 1 / 3
  ]
    .map(tc => {
      if (tc < 0) {
        return tc + 1;
      }
      if (tc > 1) {
        return tc - 1;
      }
      return tc;
    })
    .map(
      tc => {
        if (tc < 1 / 6) {
          return p + ((q - p) * 6 * tc);
        }
        if (1 / 6 <= tc && tc < 1 / 2) {
          return q;
        }
        if (1 / 2 <= tc && tc < 2 / 3) {
          return p + ((q - p) * 6 * (2 / 3 - tc));
        }
        return p;
      }
    )
    .map(tc => Math.round(tc * 256));
}


export default class Color {
  public static fromKeywordColorToken(token: string): Color | null {
    if (token === 'transparent') {
      return new Color(0, 0);
    }

    // hexadecimal token
    if (token.startsWith('#')) {
      if (!hexadecimalRegex.test(token)) {
        return null;
      }

      return new Color(token, 1);

    }

    const hexadecimal = keyword2HexadecimalMap[token];
    if (hexadecimal) {
      return new Color(hexadecimal, 1);
    }

    return null;
  }

  public static fromFunctionalColorToken(token: string): Color | null {
    const matchedArray = functionalColorRegex.exec(token);
    if (!matchedArray) { return null; }

    const [, schema, ...vectorTokens] = matchedArray;
    if (schema.toLowerCase() === 'rgb' || schema.toLowerCase() === 'rgba') {
      let [redToken, greenToken, blueToken, alphaToken = '1'] = vectorTokens;
      const tokenRegexMatchArrays = [redToken, greenToken, blueToken]
        .map(token => RGBAVectorTokenRegex.exec(token));
      if (tokenRegexMatchArrays.some(regex => !regex)) {
        return null;
      }
      const RGBVectors: number[] = [];
      for (let matchArray of tokenRegexMatchArrays) {
        // just for passing typescript language type check
        if (!matchArray) {
          return null;
        }

        let [, valueToken, percentage] = matchArray;
        if (valueToken.startsWith('.')) {
          valueToken = '0' + valueToken;
        }

        let value = Math.round(percentage ?
          parseFloat(valueToken) * 255 / 100 :
          parseInt(valueToken));

        if (isNaN(value) || value >> 24) {
          return null;
        }

        value = Math.max(value, 0);
        value = Math.min(value, 255);

        RGBVectors.push(value);
      }

      const alphaMatchArray = RGBAVectorTokenRegex.exec(alphaToken);
      let alphaValue = 1;
      if (alphaMatchArray) {
        let [, valueToken, percentage] = alphaMatchArray;
        if (valueToken.startsWith('.')) {
          valueToken = '0' + valueToken;
        }

        alphaValue = percentage ?
          parseFloat(valueToken) / 100 :
          parseFloat(valueToken);

        alphaValue = Math.max(0, alphaValue);
        alphaValue = Math.min(1, alphaValue);
      }

      return new Color(RGBVectors, alphaValue, 'rgb');
    } else if (schema === 'hsl') {
      const [hueToken, saturationToken, lightnessToken] = vectorTokens;
      const HSLVectors = [];

      // use `test` instead of `exec`, matched string is our expected

      if (!HueVectorTokenRegex.test(hueToken)) { return null; }
      let hueValue = parseInt(hueToken);

      // normalize hue angle
      hueValue = ((hueValue % 360) + 360) % 360;
      HSLVectors.push(hueValue);

      const matchArrays = [saturationToken, lightnessToken]
        .map(token => SaturationLightnessVectorTokenRegex.exec(token));

      if (matchArrays.some(array => !array)) {
        return null;
      }
      for (let matchArray of matchArrays) {
        // just for passing Typescript type check
        if (!matchArray) {
          return null;
        }
        const [, valueToken] = matchArray;
        let value = parseInt(valueToken) / 100;
        value = Math.min(1, value);
        value = Math.max(0, value);
        HSLVectors.push(value);
      }
      return new Color(HSLVectors, 1, 'hsl');
    }
    return null;
  }

  private constructor(
    colorValue: string | number | number[],
    alpha = 1,
    schema: 'rgb' | 'hsl' | 'hexadecimal' = 'hexadecimal'
  ) {
    this.alpha = alpha;

    if (schema === 'hexadecimal' && !Array.isArray(colorValue)) {
      this.initHexadecimalColorValue(colorValue);
    }

    if (Array.isArray(colorValue)) {
      if (schema === 'rgb') {
        this.initRGBColorValue(colorValue);
      } else if (schema === 'hsl') {
        this.initHSLColorValue(colorValue);
      }
    }

  }

  private initHexadecimalColorValue(colorValue: string | number) {
    if (typeof colorValue === 'string') {
      colorValue = colorValue.toLowerCase();
      this._threeDigitHexadecimal = colorValue.length === 4 ? colorValue : '';

      this._sixDightHexadecimal = colorValue.length === 4 ?
        '#' + colorValue
          .slice(1)
          .split("")
          .map(dight => dight.repeat(2))
          .join("")
        : colorValue;

      this.hexadecimalValue = parseInt(this.sixDightHexadecimal.replace('#', '0x'));
    } else {
      this.hexadecimalValue = colorValue;
      this.setSixDightHexadecimal();
    }

    this.setRGBAndRGBAColor();
    this.setThreeDightHexadecimal();
  }

  private initRGBColorValue([red, green, blue]: number[]) {
    // #FFFFFF
    this.hexadecimalValue = (red << 16) | (green << 8) | blue;
    this.setSixDightHexadecimal();
    this.setThreeDightHexadecimal();
    this.setRGBAndRGBAColor();
  }

  private initHSLColorValue([hue, saturation, lightness]: number[]) {
    this.setHSLColor(hue, saturation, lightness);
    this.initRGBColorValue(HSL2RGB(hue, saturation, lightness));
  }

  setSixDightHexadecimal() {
    const rowHexadecimal = this.hexadecimalValue.toString(16);
    this._sixDightHexadecimal = `#${'0'.repeat(6 - rowHexadecimal.length)}${rowHexadecimal}`;
  }

  private setRGBAndRGBAColor() {
    if (this.alpha === 0) {
      this._RGBA = 'rgba(0, 0, 0, 0)';
      this._percentRGBA = 'rgba(0%, 0%, 0%, 0)';
      return;
    }

    if (this.RGB === '' && this.RGBA === '') {
      const blue = this.hexadecimalValue & 0x0000FF;
      const green = (this.hexadecimalValue & 0x00FF00) >> 8;
      const red = (this.hexadecimalValue & 0xFF0000) >> 16;

      const redPercent = (red / 255 * 100).toFixed(1);
      const greenPercent = (green / 255 * 100).toFixed(1);
      const bluePercent = (blue / 255 * 100).toFixed(1);
      const alphaPercent = (this.alpha * 100).toFixed(1);

      if (this.alpha === 1) {
        this._RGB = `rgb(${red}, ${green}, ${blue})`;
        this._percentRGB = `rgb(${redPercent}%, ${greenPercent}%, ${bluePercent}%)`;
      }
      this._RGBA = `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
      this._percentRGBA = `rgba(${redPercent}%, ${greenPercent}%, ${bluePercent}%, ${alphaPercent}%)`;
    }
  }

  private setThreeDightHexadecimal() {
    if (this.threeDightHexadecimal === '' && this.alpha === 1) {
      if (canTransformToThreeDightHexadacimalRegex.test(this.sixDightHexadecimal)) {

        const blueLowDight = (this.hexadecimalValue & 0x00000F).toString(16);
        const greenLowDight = ((this.hexadecimalValue & 0x000F00) >> 8).toString(16);
        const redLowDight = ((this.hexadecimalValue & 0x0F0000) >> 16).toString(16);

        this._threeDigitHexadecimal = `#${redLowDight}${greenLowDight}${blueLowDight}`;
      } else {
        this._threeDigitHexadecimal = '';
      }
    }
  }

  private setHSLColor(...params: number[]) {
    if (!params) {
      const blue = this.hexadecimalValue & 0x0000FF;
      const green = (this.hexadecimalValue & 0x00FF00) >> 8;
      const red = (this.hexadecimalValue & 0xFF0000) >> 16;
      params = RGB2HSL(red, green, blue);
    }

    const [hue, saturation, lightness] = params;
    this._HSL = `hsl(${hue}, ${saturation}, ${lightness})`;

  }

  hexadecimalValue = 0;
  private alpha = 1;

  private _sixDightHexadecimal = '';

  get sixDightHexadecimal() {
    return this._sixDightHexadecimal;
  }

  private _threeDigitHexadecimal = '';
  get threeDightHexadecimal() {
    return this._threeDigitHexadecimal;
  }

  private _RGB = '';

  get RGB() {
    return this._RGB;
  }

  private _percentRGB = '';
  get percentRGB() {
    return this._percentRGB;
  }

  private _RGBA = '';

  get RGBA() {
    return this._RGBA;
  }

  private _percentRGBA = '';
  get percentRGBA() {
    return this._percentRGBA;
  }

  private _HSL = '';

  get HSL() {
    return this._HSL;
  }


  get transparent() {
    return this.alpha === 0 ? 'transparent' : '';
  }
}