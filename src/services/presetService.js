let fs = require('fs');

ngapp.service('presetService', function () {
    let service = this;
    let presets = [];

    service.savePresets = function () {
        fs.writeFileSync('presets.json', JSON.stringify(presets));
    };

    service.loadPresets = function () {
        if (fs.existsSync('presets.json')) {
            presets = JSON.parse(fs.readFileSync('presets.json', 'utf8'));
        }
    };

    service.storeGlobalPreset = function (preset) {
        presets.push(preset);
    };

    service.getPreset = function (presetName) {
        return presets.find(function (presetInArray) {
            return presetInArray.presetName === presetName;
        });
    };

    service.getPresets = function () {
        return presets;
    };
});