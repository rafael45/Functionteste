const fs = require('fs');
const path = require('path');
const packets = require('./package.json');
let envInfo = require('./utils.json');

// Define local para usar em logs
envInfo.parameters.location.value = __filename;

function treeCommand(localePlace = envInfo.parameters.checkstats.arguments.localePlace.value) {
    const folderInfo = fs.lstatSync(localePlace);
    const dataInfo = {
        accessedAt: folderInfo.atimeMs,
        changedAt: folderInfo.mtimeMs,
        createdAt: folderInfo.birthtimeMs,
        directories: 0,
        files: 0,
        name: path.basename(localePlace),
        path: path.resolve(localePlace),
        size: `${(folderInfo.size / 1024).toFixed(2)} KB`,
        type: 'directory',
        contents: [],
    };

    if (folderInfo.isDirectory()) {
        envInfo.parameters.namings.value = fs.readdirSync(localePlace);
        envInfo.parameters.folders.value = envInfo.parameters.namings.value.filter((fol) =>
            fs.lstatSync(path.join(localePlace, fol)).isDirectory()
        );
        envInfo.parameters.archives.value = envInfo.parameters.namings.value.filter((fil) =>
            fs.lstatSync(path.join(localePlace, fil)).isFile()
        );
        dataInfo.directories = envInfo.parameters.folders.value.length;
        dataInfo.files = envInfo.parameters.archives.value.length;
        dataInfo.contents = envInfo.parameters.namings.value.map((dir) =>
            treeCommand(path.join(localePlace, dir))
        );
    } else {
        dataInfo.type = 'file';
    }

    envInfo.results.value = dataInfo;
    envInfo.parameters.success.value = true;
    return dataInfo;
}

function treeCaller(placeLocation = envInfo.parameters.tree.arguments.placeLocation.value) {
    try {
        envInfo.parameters.stock.value = placeLocation;
        if (!fs.existsSync(envInfo.parameters.stock.value)) {
            envInfo.parameters.stock.value = envInfo.parameters.tree.arguments.placeLocation.value;
        }

        treeCommand(envInfo.parameters.stock.value);

        if (envInfo.parameters.finish.value === true) {
            setTimeout(() => {
                envInfo.parameters.revert.value();
            }, envInfo.parameters.wait.value);
        }

        return envInfo;
    } catch (error) {
        if (envInfo.parameters.error.value === true) {
            console.error(error);
        }

        if (envInfo.parameters.reset.value === true) {
            setTimeout(() => {
                envInfo.parameters.revert.value();
            }, envInfo.parameters.wait.value);
        }

        envInfo.parameters.message.value = error.message;
        envInfo.parameters.code.value = error.code || 'Other';
        envInfo.parameters.success.value = false;
        return envInfo;
    }
}

function ambientDetails() {
    return envInfo;
}

function packageJSON() {
    return packets;
}

function resetAmbient(changeKey = {}) {
    envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

    if (Object.keys(changeKey).length !== 0) {
        Object.keys(changeKey).forEach((key) => {
            if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                envInfo[key] = changeKey[key];
            }
        });
    }

    envInfo.parameters.checkstats.value = treeCommand;
    envInfo.parameters.ambient.value = ambientDetails;
    envInfo.parameters.tree.value = treeCaller;
    envInfo.parameters.revert.value = resetAmbient;
    envInfo.parameters.pack.value = packageJSON;

    module.exports = {
        View: {
            env: envInfo.parameters.ambient.value,
            init: envInfo.parameters.tree.value,
            reset: envInfo.parameters.revert.value,
            pack: envInfo.parameters.pack.value,
        },
        Developer: 'KillovSky',
        Projects: 'https://github.com/KillovSky',
    };

    return module.exports;
}

// Executa o reset inicial
resetAmbient();
