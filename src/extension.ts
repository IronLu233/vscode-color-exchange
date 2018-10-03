'use strict';
import * as vscode from 'vscode';
import { window, Command, Position, WorkspaceEdit, workspace, Uri, Range, TextLine } from 'vscode';
import Color from './color';
import { getKeywordColorToken, getFunctionalColorToken } from './getColorToken';

// NOTE: use `import` will leave an error of leaking type definition
const LRUMap = require('collections/lru-map');

const cache = LRUMap({}, 500);

export function activate(context: vscode.ExtensionContext) {

    console.log('"vscode-color-exchange" is active!');

    let disposable = vscode.commands.registerCommand('color-exchange.changeColor',
        (uri: Uri, colorUnit: string, newText: string, cursorPosition: Position, line: TextLine) => {
            const tokenStartCharacterIndex = line.text.indexOf(colorUnit);

            if (!window.activeTextEditor || tokenStartCharacterIndex === -1) { return; }

            const startPosition = new Position(cursorPosition.line, tokenStartCharacterIndex);
            const endPosition = startPosition.translate(0, colorUnit.length);

            const editRange = new Range(startPosition, endPosition);
            const edit = new WorkspaceEdit();
            edit.replace(uri, editRange, newText);
            workspace.applyEdit(edit);
        }
    );

    context.subscriptions.push(disposable);

    disposable = vscode.languages.registerCodeActionsProvider('*', {
        provideCodeActions(document) {
            const commands: Command[] = [];
            const { activeTextEditor } = window;

            if (!activeTextEditor) {
                return [];
            }

            const { start: startPosition } = activeTextEditor.selection;
            const line = document.lineAt(startPosition);

            function pushModifyCommand(token: string, newText: string) {
                if (newText) {
                    commands.push({
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    });
                }
            }

            let token: string, color: Color | null = null;

            if (token = getKeywordColorToken(line.text, startPosition.character)) {
                color = cache.get(token) || Color.fromKeywordColorToken(token);
            }
            if (!color && (token = getFunctionalColorToken(line.text, startPosition.character))) {
                color = cache.get(token) || Color.fromFunctionalColorToken(token);
            }

            if (!color) {
                // this line has no token, return empty array
                return [];
            }

            // set the cache
            if (!cache.has(token)) {
                cache.set(token, color);
            }

            const {
                threeDightHexadecimal,
                sixDightHexadecimal,
                RGB,
                percentRGB,
                RGBA,
                percentRGBA,
                HSL
            } = color;
            [
                threeDightHexadecimal,
                threeDightHexadecimal.toUpperCase() !== threeDightHexadecimal ?
                    threeDightHexadecimal.toUpperCase() : '',
                sixDightHexadecimal,
                sixDightHexadecimal.toUpperCase() !== sixDightHexadecimal ?
                    sixDightHexadecimal.toUpperCase() : '',
                RGB,
                percentRGB,
                RGBA,
                percentRGBA,
                HSL
            ].forEach(colorUnit => pushModifyCommand(token, colorUnit));

            return commands;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}