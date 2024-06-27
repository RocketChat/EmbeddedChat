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
        i18nDescription: "Specifies the width of the EC Container.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
    },
    {
        id: "ec-height",
        i18nLabel: "Height",
        i18nDescription: "Specifies the height of the EC Container.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
    },

    {
        id: "fallback-name",
        i18nLabel: "Fallback Channel Name",
        i18nDescription:
            "Specifies a fallback name for the channel before the user successfully logs in.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
    },

    {
        id: "anonymous-mode",
        i18nLabel: "Anonymous Mode",
        i18nDescription:
            "Allows users to read channel messages without logging in. This is only applicable if the work allows anonymous read.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: true,
    },
];
