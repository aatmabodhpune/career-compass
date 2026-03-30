/**
 * Classification Layer
 *
 * Converts a flat response map (e.g. { p1: 3, i1: 4, a1: "C" })
 * into the structured domain format expected by the normalizer.
 *
 * Rules:
 *   - Keys starting with "p" → personality
 *   - Keys starting with "i" → interest
 *   - Keys starting with "a" → aptitude
 *   - Unknown prefixes are silently ignored
 */
export function classifyResponses(responses: Record<string, any>) {
    const classified = {
        personality: {} as Record<string, any>,
        interest: {} as Record<string, any>,
        aptitude: {} as Record<string, any>
    };

    for (const key in responses) {
        const value = responses[key];

        if (key.startsWith("p")) {
            classified.personality[key] = value;
        } else if (key.startsWith("i")) {
            classified.interest[key] = value;
        } else if (key.startsWith("a")) {
            classified.aptitude[key] = value;
        }
    }

    return classified;
}
