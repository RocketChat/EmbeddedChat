import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

export const authSettings: ISetting[] = [
    {
        id: "client-id",
        i18nLabel: "Client ID",
        i18nDescription: "The client id of the third party login app",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },
    {
        id: "client-secret",
        i18nLabel: "Client Secret",
        i18nDescription: "The client secret of the third party login app",
        type: SettingType.PASSWORD,
        required: true,
        public: false,
        packageValue: "",
    },
    {
        id: "allowed-origins",
        i18nLabel: "Allowed origins",
        i18nDescription:
            "The allowed origins for third party login for EmbeddedChat (Comma separated). Leave blank to allow all origins.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
        multiline: true,
    },
    {
        id: "custom-oauth-name",
        i18nLabel: "Custom OAuth Name",
        i18nDescription:
            "Provide name with which the custom oauth is saved. The custom oauth should be configured with the above third party login app.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
    },
];

export const propSettings: ISetting[] = [
    {
        id: "ec-width",
        i18nLabel: "Width",
        i18nDescription: "The width of EC Container",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },

    {
        id: "ec-height",
        i18nLabel: "Height",
        i18nDescription: "The height of EC Container",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },
];
