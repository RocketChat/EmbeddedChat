/**
 * @deprecated
 * AIContext is no longer needed. The AI adapter is passed as a prop directly
 * to <EmbeddedChat aiAdapter={...}> and flows through ECOptions via RCContext,
 * consistent with how `host`, `roomId`, and other options are handled.
 *
 * Use `useRCContext().ECOptions.aiAdapter` to access the adapter in components.
 */
