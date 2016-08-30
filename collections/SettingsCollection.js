Settings = new Mongo.Collection('settings');

SettingsSchema = new SimpleSchema({
    dateFormat: {
        type: String,
        label: "Date format (momentJS notation)",
        defaultValue: "DD.MM.YY"
    },
    csvDelimiter: {
        type: String,
        label: "CSV delimiter",
        defaultValue: ","
    },
});

Settings.attachSchema(SettingsSchema);
