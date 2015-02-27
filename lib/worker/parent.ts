///ts:ref=globals
/// <reference path="../globals.ts"/> ///ts:ref:generated

import childprocess = require('child_process');
var exec = childprocess.exec;
var spawn = childprocess.spawn;

import workerLib = require('./lib/workerLib');
import tsconfig = require('../main/tsconfig/tsconfig');


var parent = new workerLib.Parent();
export function startWorker() {
    parent.startWorker(__dirname + '/child.js', showError);
    console.log('AtomTS worker started')
}

export function stopWorker() {
    parent.stopWorker();
}

function showError(error: Error) {
    var message = "Failed to start a child TypeScript worker. Atom-TypeScript is disabled.";
    // Sad panda : https://github.com/TypeStrong/atom-typescript/issues/50
    if (process.platform === "win32") {
        message = message + " Make sure you have 'node' installed and available in your system path.";
    }
    atom.notifications.addError(message, { dismissable: true });

    if (error) {
        console.error('Failed to activate ts-worker:', error);
    }
}

/////////////////////////////////////// END INFRASTRUCTURE ////////////////////////////////////////////////////

/** Doesn't mess with any data. Just shows it nicely in the UI */
function catchCommonErrors<Query, Response>(func: workerLib.QRFunction<Query, Response>): workerLib.QRFunction<Query, Response> {
    return (q) => func(q).catch((err: Error) => {
        if (err.message == tsconfig.errors.GET_PROJECT_JSON_PARSE_FAILED) {
            atom.notifications.addError('The tsconfig.json file for this TypeScript file contains invalid JSON');
        }
        return <any>Promise.reject(err);
    });
}

///ts:import=projectService
import projectService = require('../main/lang/projectService'); ///ts:import:generated

export var echo = catchCommonErrors(parent.sendToIpc(projectService.echo));
export var quickInfo = catchCommonErrors(parent.sendToIpc(projectService.quickInfo));
export var build = catchCommonErrors(parent.sendToIpc(projectService.build));
export var errorsForFileFiltered = catchCommonErrors(parent.sendToIpc(projectService.errorsForFileFiltered));
export var getCompletionsAtPosition = catchCommonErrors(parent.sendToIpc(projectService.getCompletionsAtPosition));
export var emitFile = catchCommonErrors(parent.sendToIpc(projectService.emitFile));
export var regenerateProjectGlob = catchCommonErrors(parent.sendToIpc(projectService.regenerateProjectGlob));
export var formatDocument = catchCommonErrors(parent.sendToIpc(projectService.formatDocument));
export var formatDocumentRange = catchCommonErrors(parent.sendToIpc(projectService.formatDocumentRange));
export var getDefinitionsAtPosition = catchCommonErrors(parent.sendToIpc(projectService.getDefinitionsAtPosition));
export var updateText = catchCommonErrors(parent.sendToIpc(projectService.updateText));
export var errorsForFile = catchCommonErrors(parent.sendToIpc(projectService.errorsForFile));
export var getSignatureHelps = catchCommonErrors(parent.sendToIpc(projectService.getSignatureHelps));
export var getRenameInfo = catchCommonErrors(parent.sendToIpc(projectService.getRenameInfo));
export var getRelativePathsInProject = catchCommonErrors(parent.sendToIpc(projectService.getRelativePathsInProject));

// Automatically include all functions from "parentResponses" as responders
import queryParent = require('./queryParent');
parent.registerAllFunctionsExportedFromAsResponders(queryParent);
