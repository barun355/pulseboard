
export const ClerkWebhookEvents = {
    UserCreated: "user:created",
}

export type ClerkWebhookEvent = typeof ClerkWebhookEvents[keyof typeof ClerkWebhookEvents]