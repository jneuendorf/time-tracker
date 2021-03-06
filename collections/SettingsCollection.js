Settings = new Mongo.Collection("settings");

SettingsSchema = new SimpleSchema({
    fetchProjectsUrl: {
        type: String,
        label: "URL to fetch projects from",
        autoform: {
            afFieldInput: {
                placeholder: "http://www.dev-server.com/projects.json"
            }
        }
    },
    fetch_username: {
        type: String,
        label: "User name (fetch)",
    },
    fetch_password: {
        type: String,
        label: "Password (fetch)",
        autoform: {
            type: "password"
        }
    },
    updateProjectUrl: {
        type: String,
        label: "URL to update a project to",
        autoform: {
            afFieldInput: {
                placeholder: "http://www.dev-server.com/project/update?project_name=%p&entries=%e",
                class: "updateProjectUrl",
                "data-toggle": "tooltip",
                "data-placement": "top",
            }
        }
    },
    update_username: {
        type: String,
        label: "User name (update)",
    },
    update_password: {
        type: String,
        label: "Password (update)",
        autoform: {
            type: "password"
        }
    },
    // dateFormat: {
    //     type: String,
    //     label: "Date format (momentJS notation)",
    //     defaultValue: "DD.MM.YY"
    // },
    csvDelimiter: {
        type: String,
        label: "CSV delimiter",
        defaultValue: ","
    },
});

Settings.attachSchema(SettingsSchema);
