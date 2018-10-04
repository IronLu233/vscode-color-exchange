# vscode-color-exchange README
![Build Status](https://travis-ci.org/IronLu233/vscode-color-exchange.svg?branch=master)

(https://travis-ci.org/IronLu233/vscode-color-exchange)
A VS code extension uses `VS code`'s code action for refactoring your color unit code. It can transform your color unit to RGB, RGBA, etc.

## Features
convert your color token to:
- RGB, RGBA
- HSL
- 6-dight hexadecimal and 3-dight hexadecimal(if available)

![2018-10-03 11 59 49](https://user-images.githubusercontent.com/20639676/46391328-f04f5280-c70e-11e8-8fb9-fe68ae643f8c.gif)
## Installation
In order to install an extension you need to launch the Command Pallete (Ctrl + Shift + P or Cmd + Shift + P) and type Extensions. There you have either the option to show the already installed snippets or install new ones. Search for `color-exchange` and install it.

## How to use
After installation and reload VS code, open any file and move the cursor into color unit, click the lightbulbs in your editor or Use shortcut: `Cmd + .`(`Ctrl + .` in windows), then select your new color unit.

## Requirements
`vs code` >=1.27.0

## TODOS
- [ ] Add more unit test
- [ ] Support convert other color to keyword color if available
- [ ] Add CI
- [ ] Add `codecov` for code coverage
<!-- ## Known issues
- Code action will appear at incorrect place, when cursor after `;` in `rgb(255, 255, 255);` -->

## Release Notes

### 1.0.1
- Fix code action incorrect appeared when cursor in the tail of line.
- Fix code action not appeared when cursor in color unit's function notation
- Fix the same color token in code actions which is need refactor.
### 1.0.0
Basic feature.

-----------------------------------------------------------------------------------------------------------
**Enjoy!**
