'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Command, Position, WorkspaceEdit, workspace, Uri, Range, TextLine } from 'vscode';
import Color from './color';
import { getKeywordColorToken, getFunctionalColorToken } from './getColorToken';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"vscode-color-exchange" is active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
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
            let token: string, color: Color | null = null;
            // tslint:disable-next-line:no-unused-expression
            ((token = getKeywordColorToken(line.text, startPosition.character)) &&
                (color = Color.fromKeywordColorToken(token))) ||
                ((token = getFunctionalColorToken(line.text, startPosition.character)) &&
                    (color = Color.fromFunctionalColorToken(token)));

            if (!color) {
                // this line has no token, return empty array
                return [];
            }

            if (color.RGB && color.RGB !== token) {
                const newText = color.RGB;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.percentRGB && color.percentRGB !== token) {
                const newText = color.percentRGB;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.RGBA && color.RGBA !== token) {
                const newText = color.RGBA;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.percentRGBA && color.percentRGBA !== token) {
                const newText = color.percentRGBA;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.sixDightHexadecimal && color.sixDightHexadecimal !== token) {
                const newText = color.sixDightHexadecimal;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.threeDightHexadecimal && color.threeDightHexadecimal !== token) {
                const newText = color.threeDightHexadecimal;
                commands.push(
                    {
                        title: newText,
                        command: 'color-exchange.changeColor',
                        arguments: [document.uri, token, newText, startPosition, line]
                    }
                );
            }

            if (color.HSL && color.HSL !== token) {
                const newText = color.HSL;
                commands.push({
                    title: color.HSL,
                    command: 'color-exchange.changeColor',
                    arguments: [document.uri, token, newText, startPosition, line]
                });
            }

            return commands;

        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}