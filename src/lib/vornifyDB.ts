
/**
 * Utility for interacting with VornifyDB API
 */

export const VORNIFY_API_URL = 'https://api.vornify.se/api/vornifydb';
export const DATABASE_NAME = "peak_mode_49rjf9w";

interface VornifyResponse {
  success?: boolean;
  status?: boolean;
  data?: any;
  error?: string;
}

export type VornifyCommand = 
  | "--create" 
  | "--read" 
  | "--update" 
  | "--delete" 
  | "--verify" 
  | "--append" 
  | "--update-field"
  | "--delete-field";

/**
 * Execute a command against the VornifyDB API
 */
export async function executeVornifyCommand(
  collection: string,
  command: VornifyCommand,
  data: any
): Promise<VornifyResponse> {
  try {
    const response = await fetch(VORNIFY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database_name: DATABASE_NAME,
        collection_name: collection,
        command,
        data
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("VornifyDB operation failed:", error);
    return {
      success: false,
      status: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Create a new subscriber in the database
 */
export async function addSubscriber(email: string): Promise<VornifyResponse> {
  return executeVornifyCommand("subscribers", "--create", {
    id: `subscriber_${Date.now()}`,
    email,
    subscribed_at: new Date().toISOString(),
  });
}

/**
 * Get all subscribers from the database
 */
export async function getSubscribers(): Promise<VornifyResponse> {
  return executeVornifyCommand("subscribers", "--read", {});
}
