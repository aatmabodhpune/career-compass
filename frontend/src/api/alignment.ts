import { supabase } from '../lib/supabaseClient';

export async function fetchAlignmentResults(session_id: string) {
    if (session_id === null || session_id === undefined || session_id === '') {
        return {
            data: null,
            error: "Invalid session_id"
        };
    }

    try {
        const response = await supabase.functions.invoke("compute-alignment", {
            body: { session_id }
        });

        if (response.error) {
            return {
                data: null,
                error: response.error.message
            };
        }

        return {
            data: response.data,
            error: null
        };
    } catch (err: any) {
        return {
            data: null,
            error: "Unexpected error"
        };
    }
}
