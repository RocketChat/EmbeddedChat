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
        packageValue: "100%",
    },
    {
        id: "ec-height",
        i18nLabel: "Height",
        i18nDescription: "Specifies the height of the EC Container.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "95vh",
    },

    {
        id: "fallback-name",
        i18nLabel: "Fallback Channel Name",
        i18nDescription:
            "Specifies a fallback name for the channel before the user successfully logs in.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "general",
    },

    {
        id: "room-id",
        i18nLabel: "Room ID",
        i18nDescription:
            "Specifies the id of the room to which EmbeddedChat will connect to",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "GENERAL",
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
    {
        id: "toast-bar-position",
        i18nLabel: "Toast Bar Position",
        i18nDescription:
            "Specifies the position at which the toast bar is displayed.",
        type: SettingType.SELECT,
        values: [
            { key: "bottom right", i18nLabel: "Bottom right" },
            { key: "top right", i18nLabel: "Top right" },
            { key: "bottom left", i18nLabel: "Bottom left" },
            { key: "top left", i18nLabel: "Top left" },
        ],

        required: false,
        public: false,
        packageValue: "bottom right",
    },

    {
        id: "show-roles",
        i18nLabel: "Show Roles",
        i18nDescription:
            "Specifies whether the roles of the user should be displayed in EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: false,
    },

    {
        id: "show-avatar",
        i18nLabel: "Show Avatar",
        i18nDescription:
            "Specifies whether the user's avatar should be displayed in EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: true,
    },

    {
        id: "show-username",
        i18nLabel: "Show Username",
        i18nDescription:
            "Specifies whether the user's username should be displayed in EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: false,
    },

    {
        id: "show-name",
        i18nLabel: "Show Name",
        i18nDescription:
            "Specifies whether the user's name should be displayed in EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: true,
    },

    {
        id: "enable-threads",
        i18nLabel: "Enable Threads",
        i18nDescription:
            "Specifies whether threads should be allowed in channels using EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: true,
    },

    {
        id: "ec-class-name",
        i18nLabel: "Custom ClassName for EC Component",
        i18nDescription:
            "Specifies a custom className for the EmbeddedChat component.",
        type: SettingType.STRING,
        required: false,
        public: false,
        packageValue: "",
    },

    {
        id: "hide-header",
        i18nLabel: "Hide Chat Header",
        i18nDescription:
            "Specifies whether the chat header should be hidden in EmbeddedChat.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: false,
    },

    {
        id: "secure",
        i18nLabel: "Secure Authentication",
        i18nDescription:
            "Uses HTTP-only cookies for authentication. This requires proper configuration of the EmbeddedChat RC app.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: false,
    },

    {
        id: "dark",
        i18nLabel: "Dark Mode",
        i18nDescription:
            "Enabling this will activate dark mode in the app; disabling it will show light mode.",
        type: SettingType.BOOLEAN,
        required: false,
        public: false,
        packageValue: false,
    },

    {
        id: "theme",
        i18nLabel: "Custom Theme",
        i18nDescription:
            "Define a custom theme for remotely styling EmbeddedChat. This allows you to customize the appearance and behavior of the chat interface.",
        type: SettingType.CODE,
        required: false,
        public: false,
        packageValue: "",
    },
];
