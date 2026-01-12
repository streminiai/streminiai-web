export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-keyboard-backend.vishwajeetadkine705.workers.dev";

export type BackendEndpoint = "chat" | "keyboard" | "automation" | "security" | "translation" | "image";

export interface BackendResponse {
    status: string;
    service: string;
    version: string;
    developer: string;
    timestamp: string;
    data?: unknown;
    error?: string;
}

export async function sendBackendRequest(
    endpoint: BackendEndpoint,
    data: Record<string, unknown> = {}
): Promise<BackendResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/${endpoint}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling backend endpoint ${endpoint}:`, error);
        return {
            status: "error",
            service: "Stremini AI Backend",
            version: "1.0.0",
            developer: "Stremini AI Developers",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}
