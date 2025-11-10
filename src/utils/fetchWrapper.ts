type Input = string | URL | Request;

export async function fetchRequest<T>(input: Input, init?: RequestInit): Promise<T> {
    try {
        const result = await fetch(input, init).then((res) => res.json());
        if (!result.success) throw result;
        return result;
    } catch (error) {
        throw error;
    }
}
