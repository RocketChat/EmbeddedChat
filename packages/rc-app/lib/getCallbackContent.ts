import { isAllowedOrigin } from "./isAllowedOrigin";
import { IRead } from "@rocket.chat/apps-engine/definition/accessors";

interface ICredentials {
    accessToken: string;
    expiresIn: number;
    serviceName: string;
}

export const getCallbackContent = async (
    read: IRead,
    credentials: ICredentials | null,
    origin: string,
    error
) => {
    const { accessToken, expiresIn = 3600, serviceName } = credentials || {};
    const isAllowed = await isAllowedOrigin(read, origin);
    let config: any = {};
    if (error) {
        config = {
            success: false,
            error,
        };
    } else if (!isAllowed) {
        config = {
            success: false,
            error: "origin not allowed",
        };
    } else {
        config = {
            success: true,
            origin,
            credentials: {
                accessToken,
                expiresIn,
                serviceName,
            },
        };
    }
    const closeLinkHtml = `<p><span id="message">${
        config.success ? "Login Successful" : "Login Failed: " + config.error
    }</span>. <a href="#" onclick="window.close();return false;">Close this window</a></p>`;

    return `
<!DOCTYPE html>
<html>
<body>
    <div id="config" style="display:none;">
    ${JSON.stringify(config)}
    </div>
    ${closeLinkHtml}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const config = JSON.parse(document.getElementById('config').textContent);
            if (config.success) {
                if (window.opener) {
                    // Post message to opener with credentials
                    window.opener.postMessage(
                        {
                            type: 'rc-oauth-callback',
                            credentials: config.credentials
                        },
                        config.origin
                    );
                }
            } else {
                console.error(config.error);
            }
        });
    </script>
</body>
</html>
    `;
};
