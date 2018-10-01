import * as assert from 'assert';


import Color, { keyword2HexadecimalMap } from "../color";

suite('test color model', () => {
  suite('convert from keyword token', () => {
    test('color transparent', () => {
      const transparentColor = Color.fromKeywordColorToken('transparent') as Color;
      assert.deepEqual(transparentColor, new Color(0, 0));
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
      assert.deepEqual(color, new Color(0xABCDEF));
      assert.equal(color.threeDightHexadecimal, '');
      assert.equal(color.sixDightHexadecimal, '#abcdef');
      assert.equal(color.RGB, 'rgb(171, 205, 239)');
      assert.equal(color.RGBA, 'rgba(171, 205, 239, 1)');
    });

    test('6-dight hexadecimal color #2', () => {
      const color = Color.fromKeywordColorToken('#AABBCC') as Color;
      assert.deepEqual(color, new Color(0xAABBCC));
      assert.equal(color.threeDightHexadecimal, '#abc');
      assert.equal(color.sixDightHexadecimal, '#aabbcc');
      assert.equal(color.RGB, 'rgb(170, 187, 204)');
      assert.equal(color.RGBA, 'rgba(170, 187, 204, 1)');
    });



    test('valid keyword color', () => {
      Object.keys(keyword2HexadecimalMap).forEach(key => {
        const color = Color.fromKeywordColorToken(key) as Color;
        assert.deepEqual(color, new Color(keyword2HexadecimalMap[key]));
        assert.equal(color.sixDightHexadecimal.toUpperCase(), keyword2HexadecimalMap[key]);
      });
    });

    test('invalid hexadecimal color #1', () => {
      assert.equal(Color.fromKeywordColorToken('#AACF'), null);
    });

    test('invalid hexadecimal color #2', () => {
      assert.equal(Color.fromKeywordColorToken('#GGZZWW'), null);
    });
  });
});
