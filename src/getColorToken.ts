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
    resultToken += prefixMatchArray[0];

    const functionNotation = prefix.substr(Math.max(prefixMatchArray.index - 4, 0), prefixMatchArray.index);
    let functionNotationMatchArray: RegExpExecArray | null;
    if (functionNotationMatchArray = functionNotationRegex.exec(functionNotation)) {
      resultToken = functionNotationMatchArray[0] + resultToken;
    } else {
      // the word before left parenthesis is not 'rgb' or 'rgba' or 'hsl'
      // means it doesn't match any functional color
      return '';
    }

  }
  if (suffixMatchArray) { // matched right parenthesis
    if (prefixMatchArray) { //if left parenthesis is in `prefixMatchArray`
      resultToken += suffixMatchArray[0];
    } else { // all token may in suffix array
      const tokenContainsString = line.substr(
        Math.max(0, prefix.length + suffixMatchArray.index - 4),
        prefix.length + suffixMatchArray.index + suffixMatchArray[0].length
      );
      const roughFunctionalColorMatchArray = roughFunctionalColorRegex.exec(tokenContainsString);
      return roughFunctionalColorMatchArray ? roughFunctionalColorMatchArray[0] : '';
    }
  }

  return resultToken;
}