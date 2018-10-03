const keywordColorTokenPrefixRegex = /#?[\w]*$/;
const keywordColorTokenSuffixRegex = /^#?[\w]*/;

const functionalColorTokenPrefixRegex = /\(.*?$/;
const functionalColorTokenSuffixRegex = /^.*?\)/;
const roughFunctionalColorRegex = /((rgba)|(rgb)|(hsl))\(.+?\)/i;
const functionNotationRegex = /(rgba)|(rgb)|(hsl)/i;

export function getKeywordColorToken(line: string, cursor: number): string {
  const prefix = line.substr(0, cursor);
  const suffix = line.substr(cursor);
  const prefixMatchArray = keywordColorTokenPrefixRegex.exec(prefix);
  const suffixMatchArray = keywordColorTokenSuffixRegex.exec(suffix);
  let resultToken = '';
  if (prefixMatchArray) {
    resultToken += prefixMatchArray[0];
  }
  if (suffixMatchArray) {
    resultToken += suffixMatchArray[0];
  }
  return resultToken;
}

export function getFunctionalColorToken(line: string, cursor: number): string {

  const prefix = line.substr(0, cursor);
  const suffix = line.substr(cursor);
  const prefixMatchArray = functionalColorTokenPrefixRegex.exec(prefix);
  const suffixMatchArray = functionalColorTokenSuffixRegex.exec(suffix);
  let resultToken = '';
  if (prefixMatchArray) { // matched left parenthesis
    if (!suffixMatchArray) { // all token string is on the left of cursor
      const tokenContainsString = line.slice(
        Math.max(prefixMatchArray.index - 4, 0),
        prefixMatchArray.index + prefixMatchArray[0].length
      );
      const roughFunctionalColorMatchArray = roughFunctionalColorRegex.exec(tokenContainsString);

      if (!roughFunctionalColorMatchArray) { return ''; }
      const tokenStartIndex = Math.max(prefixMatchArray.index - 4, 0) + roughFunctionalColorMatchArray.index;
      const tokenEndIndex = tokenStartIndex + roughFunctionalColorMatchArray[0].length;
      return tokenEndIndex >= cursor ? roughFunctionalColorMatchArray[0] : '';
    }

    resultToken += prefixMatchArray[0];

    const functionNotation = prefix.substr(Math.max(prefixMatchArray.index - 4, 0), prefixMatchArray.index);
    const functionNotationMatchArray = functionNotationRegex.exec(functionNotation);
    if (functionNotationMatchArray) {
      resultToken = functionNotationMatchArray[0] + resultToken;
    } else {
      // the word before left parenthesis is not 'rgb' or 'rgba' or 'hsl'
      // means it doesn't match any functional color
      return '';
    }

  }
  if (suffixMatchArray) { // matched right parenthesis
    if (!prefixMatchArray) {
      const tokenContainsString = line.substr(
        Math.max(0, prefix.length + suffixMatchArray.index - 4),
        prefix.length + suffixMatchArray.index + suffixMatchArray[0].length
      );

      const roughFunctionalColorMatchArray = roughFunctionalColorRegex.exec(tokenContainsString);
      if (!roughFunctionalColorMatchArray) { return ''; }
      const tokenStartIndex = Math.max(0, prefix.length + suffixMatchArray.index - 4) + roughFunctionalColorMatchArray.index;
      return tokenStartIndex <= cursor ? roughFunctionalColorMatchArray[0] : '';
    }

    resultToken += suffixMatchArray[0];
  }

  return resultToken;
}