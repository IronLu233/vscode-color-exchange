const hexadecimalRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const canTransformToThreeDightHexadacimalRegex = /#(?:([0-9a-f])\1){3}/i;
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

      return new Color(token);

    }

    const hexadecimal = keyword2HexadecimalMap[token];
    if (hexadecimal) {
      return new Color(hexadecimal);
    }

    return null;
  }

  public static fromFunctionalColorToken(token: string): Color | null {
    return null;
  }

  constructor(hexadecimal: string | number, alpha = 1) {
    if (typeof hexadecimal === 'string') {
      hexadecimal = hexadecimal.toLowerCase();
      this._threeDigitHexadecimal = hexadecimal.length === 4 ? hexadecimal : '';

      this._sixDightHexadecimal = hexadecimal.length === 4 ?
        '#' + hexadecimal
          .slice(1)
          .split("")
          .map(dight => dight.repeat(2))
          .join("")
        : hexadecimal;

      this.hexadecimalValue = parseInt(this.sixDightHexadecimal.replace('#', '0x'));

    } else {
      this.hexadecimalValue = hexadecimal;

      const rowHexadecimal = this.hexadecimalValue.toString(16);
      this._sixDightHexadecimal = `#${'0'.repeat(6 - rowHexadecimal.length)}${rowHexadecimal}`;
    }

    this.alpha = alpha;

    if (this.threeDightHexadecimal === '') {
      if (canTransformToThreeDightHexadacimalRegex.test(this.sixDightHexadecimal)) {

        const blueLowDight = (this.hexadecimalValue & 0x00000F).toString(16);
        const greenLowDight = ((this.hexadecimalValue & 0x000F00) >> 8).toString(16);
        const redLowDight = ((this.hexadecimalValue & 0x0F0000) >> 16).toString(16);

        this._threeDigitHexadecimal = `#${redLowDight}${greenLowDight}${blueLowDight}`;
      } else {
        this._threeDigitHexadecimal = '';
      }
    }

    if (alpha === 1) {
      const blue = this.hexadecimalValue & 0x0000FF;
      const green = (this.hexadecimalValue & 0x00FF00) >> 8;
      const red = (this.hexadecimalValue & 0xFF0000) >> 16;
      this._RGB = `rgb(${red}, ${green}, ${blue})`;
      this._RGBA = `rgba(${red}, ${green}, ${blue}, 1)`;
    }

    if (alpha === 0) {
      this._RGBA = 'rgba(0, 0, 0, 0)';
    }
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

  private _HSL = '';

  get HSL() {
    return this._HSL;
  }

  get transparent() {
    return this.alpha === 0 ? 'transparent' : '';
  }

}