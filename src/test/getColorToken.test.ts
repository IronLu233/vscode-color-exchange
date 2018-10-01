import * as assert from 'assert';
import { getKeywordColorToken, getFunctionalColorToken } from '../getColorToken';

suite('test `getKeywordColorToken`', () => {
  const testColorEqual = (exception: string, line: string, cursor: number, excepted: string) => {
    test(exception, () => {
      assert.equal(
        getKeywordColorToken(line, cursor),
        excepted
      );
    });
  };
  suite('hexadecimal color token', () => {
    const primaryColorString = '#ABCABC';
    const colorStringWithTwoColors = '#AABBCC #DDEEFF';
    const styleLineString = 'background-color: #F4F4F4;';

    testColorEqual('should return the token when cursor in #0 index', primaryColorString, 0, primaryColorString);
    testColorEqual('should return the token when cursor in #1 index', primaryColorString, 1, primaryColorString);
    testColorEqual('should return the token when cursor in middle index', primaryColorString, 2, primaryColorString);
    testColorEqual('should return the token when cursor is the last index`', primaryColorString, 6, primaryColorString);
    testColorEqual('should return the token which cursor in it #1', colorStringWithTwoColors, 0, "#AABBCC");
    testColorEqual('should return the token which cursor in it #2', colorStringWithTwoColors, 8, "#DDEEFF");
    testColorEqual('in real style line situation #1', styleLineString, 18, '#F4F4F4');
    testColorEqual('in real style line situation #2', styleLineString, 19, '#F4F4F4');
    testColorEqual('in real style line situation #3', styleLineString, 21, '#F4F4F4');
    testColorEqual('in real style line situation #4', styleLineString, 25, '#F4F4F4');
  });

  suite('keyword color token', () => {
    const primaryKeyword = 'fuchsia';
    const twoKeywords = 'fuchsia aqua';
    const realWordLine = 'color: lime;';

    testColorEqual('in #0 index', primaryKeyword, 0, primaryKeyword);
    testColorEqual('in #1 index', primaryKeyword, 1, primaryKeyword);
    testColorEqual('in the middle index', primaryKeyword, 3, primaryKeyword);
    testColorEqual('in the last index', primaryKeyword, 6, primaryKeyword);
    testColorEqual('which cursor is in it #1', twoKeywords, 0, 'fuchsia');
    testColorEqual('which cursor is in it #2', twoKeywords, 8, 'aqua');
    testColorEqual('in real world situation #1', realWordLine, 7, 'lime');
    testColorEqual('in real world situation #3', realWordLine, 9, 'lime');
    testColorEqual('in real world situation #4', realWordLine, 11, 'lime');

  });

  suite('invalid color token', () => {
    testColorEqual('invalid color token should return empty string # 1', ';;;;;;;;;;', 0, '');
    testColorEqual('invalid color token should return empty string # 2', ';;;;;;;;;;', 5, '');
    testColorEqual('invalid color token should return empty string # 3', ';;;;;;;;;;', 8, '');
  });

});


suite('test `getFunctionalColorToken`', () => {
  const testColorEqual = (exception: string, line: string, cursor: number, excepted: string) => {
    test(exception, () => {
      assert.equal(
        getFunctionalColorToken(line, cursor),
        excepted
      );
    });
  };

  suite('RGB color token', () => {
    const RGBColor = 'RGB(6, 8, 10)';
    const realWordRGBColor = `background-color: ${RGBColor};`;
    testColorEqual('when cursor is in the first', RGBColor, 0, RGBColor);
    testColorEqual('when cursor is in color function notation', RGBColor, 1, RGBColor);
    testColorEqual('when cursor is before left parenthesis', RGBColor, 3, RGBColor);
    testColorEqual('when cursor is behind left parenthesis', RGBColor, 4, RGBColor);
    testColorEqual('when cursor is in parentheses', RGBColor, 5, RGBColor);
    testColorEqual('when cursor is behind right parenthesis', RGBColor, 11, RGBColor);

    testColorEqual('in real world situation when cursor is in the first', realWordRGBColor, 18, RGBColor);
    testColorEqual('in real world situation when cursor is in color function notation', realWordRGBColor, 19, RGBColor);
    testColorEqual('in real world situation when cursor is before left parenthesis', realWordRGBColor, 21, RGBColor);
    testColorEqual('in real world situation when cursor is behind left parenthesis', realWordRGBColor, 22, RGBColor);
    testColorEqual('in real world situation when cursor is in parentheses', realWordRGBColor, 23, RGBColor);
    testColorEqual('in real world situation when cursor is behind right parenthesis', realWordRGBColor, 29, RGBColor);
  });

  suite('RGBA color token', () => {
    const RGBAColor = 'RGBA(6, 8, 10)';
    const realWordRGBColor = `background-color: ${RGBAColor};`;
    testColorEqual('when cursor is in the first', RGBAColor, 0, RGBAColor);
    testColorEqual('when cursor is in color function notation', RGBAColor, 1, RGBAColor);
    testColorEqual('when cursor is before left parenthesis', RGBAColor, 4, RGBAColor);
    testColorEqual('when cursor is behind left parenthesis', RGBAColor, 5, RGBAColor);
    testColorEqual('when cursor is in parentheses', RGBAColor, 6, RGBAColor);
    testColorEqual('when cursor is behind right parenthesis', RGBAColor, 12, RGBAColor);

    testColorEqual('in real world situation when cursor is in the first', realWordRGBColor, 18, RGBAColor);
    testColorEqual('in real world situation when cursor is in color function notation', realWordRGBColor, 19, RGBAColor);
    testColorEqual('in real world situation when cursor is before left parenthesis', realWordRGBColor, 21, RGBAColor);
    testColorEqual('in real world situation when cursor is behind left parenthesis', realWordRGBColor, 22, RGBAColor);
    testColorEqual('in real world situation when cursor is in parentheses', realWordRGBColor, 24, RGBAColor);
    testColorEqual('in real world situation when cursor is behind right parenthesis', realWordRGBColor, 30, RGBAColor);
  });

  suite('HSL color token', () => {
    const HSLColor = 'RGB(6, 8, 10)';
    const realWordHSLColor = `background-color: ${HSLColor};`;
    testColorEqual('when cursor is in the first', HSLColor, 0, HSLColor);
    testColorEqual('when cursor is in color function notation', HSLColor, 1, HSLColor);
    testColorEqual('when cursor is before left parenthesis', HSLColor, 3, HSLColor);
    testColorEqual('when cursor is behind left parenthesis', HSLColor, 4, HSLColor);
    testColorEqual('when cursor is in parentheses', HSLColor, 5, HSLColor);
    testColorEqual('when cursor is behind right parenthesis', HSLColor, 11, HSLColor);

    testColorEqual('in real world situation when cursor is in the first', realWordHSLColor, 18, HSLColor);
    testColorEqual('in real world situation when cursor is in color function notation', realWordHSLColor, 19, HSLColor);
    testColorEqual('in real world situation when cursor is before left parenthesis', realWordHSLColor, 21, HSLColor);
    testColorEqual('in real world situation when cursor is behind left parenthesis', realWordHSLColor, 22, HSLColor);
    testColorEqual('in real world situation when cursor is in parentheses', realWordHSLColor, 23, HSLColor);
    testColorEqual('in real world situation when cursor is behind right parenthesis', realWordHSLColor, 29, HSLColor);
  });

  suite('invalid color token', () => {
    testColorEqual('without color function notation should return empty string', '(6, 8, 10)', 2, '');
    testColorEqual('only match right parenthesis should return empty string', '6, 8, 10)', 0, '');
  });
});