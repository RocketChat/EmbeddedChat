import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { settings } from './settings/settings';
import { CallbackEndpoint } from './endpoints/CallbackEndpoint';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { getCallbackUrl } from './lib/getCallbackUrl';

export class EmbeddedChatApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    protected async extendConfiguration(
        configuration: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        await Promise.all(
            settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            )
        );
        await configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [new CallbackEndpoint(this)],
        });
        const callbackUrl = await getCallbackUrl(this);
        this.getLogger().log({callbackUrl})
        await configuration.settings.provideSetting({
            id: "callback-url",
            i18nLabel: "Callback URL (DO NOT CHANGE)",
            i18nDescription:
                "Add this callback url to the third party login app's redirect url list",
            required: false,
            type: SettingType.STRING,
            packageValue: "",
            public: false,
            value: callbackUrl,
        });
    }
}
