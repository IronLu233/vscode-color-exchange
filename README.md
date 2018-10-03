# vscode-color-exchange README

A VS code extension uses `VS code`'s code action for refactoring your color unit code. It can transform your color unit to RGB, RGBA, etc.

## Features
convert your color token to:
- RGB, RGBA
- HSL
- 6-dight hexadecimal and 3-dight hexadecimal(if available)

![2018-10-03 11 59 49](https://user-images.githubusercontent.com/20639676/46391328-f04f5280-c70e-11e8-8fb9-fe68ae643f8c.gif)

## Requirements
`vs code` >=1.27.0

## TODOS
- [ ] Add more unit test
- [ ] Support convert other color to keyword color if available
- [ ] Add CI
- [ ] Add `codecov` for code coverage
## Known issues
- Code action will appear at incorrect place, when cursor after `;` in `rgb(255, 255, 255);`

## Release Notes
### 1.0.0
Basic feature.

-----------------------------------------------------------------------------------------------------------
**Enjoy!**
