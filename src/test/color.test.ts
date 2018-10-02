import * as assert from 'assert';


import Color, { keyword2HexadecimalMap } from "../color";

suite('test color model', () => {
  suite('convert from keyword token', () => {
    test('color transparent', () => {
      const transparentColor = Color.fromKeywordColorToken('transparent') as Color;
      assert.equal(transparentColor.transparent, 'transparent');
    });

    test('3-dight hexadecimal color', () => {
      const color = Color.fromKeywordColorToken('#ABC') as Color;
      assert.equal(color.sixDightHexadecimal, '#aabbcc');
      assert.equal(color.threeDightHexadecimal, '#abc');
      assert.equal(color.RGB, 'rgb(170, 187, 204)');
    });

    test('6-dight hexadecimal color #1', () => {
      const color = Color.fromKeywordColorToken('#ABCDEF') as Color;
      assert.equal(color.threeDightHexadecimal, '');
      assert.equal(color.sixDightHexadecimal, '#abcdef');
      assert.equal(color.RGB, 'rgb(171, 205, 239)');
      assert.equal(color.RGBA, 'rgba(171, 205, 239, 1)');
    });

    test('6-dight hexadecimal color #2', () => {
      const color = Color.fromKeywordColorToken('#AABBCC') as Color;
      assert.equal(color.threeDightHexadecimal, '#abc');
      assert.equal(color.sixDightHexadecimal, '#aabbcc');
      assert.equal(color.RGB, 'rgb(170, 187, 204)');
      assert.equal(color.RGBA, 'rgba(170, 187, 204, 1)');
    });



    test('valid keyword color', () => {
      Object.keys(keyword2HexadecimalMap).forEach(key => {
        const color = Color.fromKeywordColorToken(key) as Color;
        assert.equal(color.sixDightHexadecimal.toUpperCase(), keyword2HexadecimalMap[key]);
      });
    });

    test('invalid keyword color', () => {
      assert.equal(Color.fromKeywordColorToken('invalidToken'), null);
    });

    test('invalid hexadecimal color #1', () => {
      assert.equal(Color.fromKeywordColorToken('#AACF'), null);
    });

    test('invalid hexadecimal color #2', () => {
      assert.equal(Color.fromKeywordColorToken('#GGZZWW'), null);
    });
  });

  suite('convert from functional color', () => {
    test('RGB color #1', () => {
      const color = Color.fromFunctionalColorToken('rgb(255, 255, 255)') as Color;
      assert.notEqual(color, null);
      assert.equal(color.RGB, 'rgb(255, 255, 255)');
      assert.equal(color.RGBA, 'rgba(255, 255, 255, 1)');
      assert.equal(color.percentRGB, 'rgb(100.0%, 100.0%, 100.0%)');
      assert.equal(color.percentRGBA, 'rgba(100.0%, 100.0%, 100.0%, 100.0%)');
      assert.equal(color.sixDightHexadecimal, '#ffffff');
    });
    test('RGB color #2', () => {
      const color = Color.fromFunctionalColorToken('rgb(50%, 50%, 50%)') as Color;

      assert.notEqual(color, null);
      assert.equal(color.RGB, 'rgb(128, 128, 128)');
      assert.equal(color.percentRGB, 'rgb(50.2%, 50.2%, 50.2%)');
      assert.equal(color.RGBA, 'rgba(128, 128, 128, 1)');
      assert.equal(color.percentRGBA, 'rgba(50.2%, 50.2%, 50.2%, 100.0%)');
    });

    test('RGBA color #1', () => {
      const color = Color.fromFunctionalColorToken('rgba(128, 128, 128, .5)') as Color;
      assert.notEqual(color, null);
      assert.equal(color.RGB, '');
      assert.equal(color.RGBA, 'rgba(128, 128, 128, 0.5)');
      assert.equal(color.percentRGB, '');
      assert.equal(color.percentRGBA, 'rgba(50.2%, 50.2%, 50.2%, 50.0%)');
    });

    test('RGBA color #2', () => {
      const color = Color.fromFunctionalColorToken('rgba(50%, 50%, 50%, 50%)') as Color;

      assert.notEqual(color, null);
      assert.equal(color.RGB, '');
      assert.equal(color.percentRGB, '');
      assert.equal(color.RGBA, 'rgba(128, 128, 128, 0.5)');
      assert.equal(color.percentRGBA, 'rgba(50.2%, 50.2%, 50.2%, 50.0%)');
    });

    test('HSL color #1', () => {
      assert.deepEqual(
        Color.fromFunctionalColorToken('hsl(264, 130%, 50%)'),
        Color.fromFunctionalColorToken('rgb(102, 0, 255)')
      );
    });
  });
});
