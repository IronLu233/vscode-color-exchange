'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Command, Position } from 'vscode';
import Color from './color';
import { getKeywordColorToken, getFunctionalColorToken } from './getColorToken';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-color-exchange" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('color-exchange.changeColor',
        (colorUnit: string, position: Position) => {
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
            function pushChangeColorCommand(colorUnit: string) {
                commands.push({
                    title: `transform to "${colorUnit}"`,
                    command: 'color-exchange.changeColor',
                    arguments: [colorUnit, startPosition]
                });
            }



            const line = document.lineAt(startPosition);
            const color = Color.fromKeywordColorToken(
                getKeywordColorToken(line.text, startPosition.character)
            ) ||
                Color.fromFunctionalColorToken(
                    getFunctionalColorToken(line.text, startPosition.character)
                );

            if (!color) {
                // this line has no token, return empty array
                return [];
            }

            // tslint:disable:no-unused-expression
            // color.hexadecimal && pushChangeColorCommand(color.hexadecimal);
            // color.RGB && pushChangeColorCommand(color.RGB);
            // color.RGBA && pushChangeColorCommand(color.RGBA);
            // color.transparent && pushChangeColorCommand(color.transparent);
            // color.HSL && pushChangeColorCommand(color.HSL);

            return commands;

        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}