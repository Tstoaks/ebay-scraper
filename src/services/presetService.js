ngapp.service('presetService', function () {
    let service = this;
    let presets = [];

    service.storeGlobalPreset = function (preset) {
        return presets.push(preset);
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