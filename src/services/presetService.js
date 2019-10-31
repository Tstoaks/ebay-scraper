ngapp.service('presetService', function () {
    let service = this;
    let presets = [];

    service.storeGlobalPreset = function (preset) {
        return presets.push(preset);
    };

    service.getPresets = function () {
        return presets;
    };
});