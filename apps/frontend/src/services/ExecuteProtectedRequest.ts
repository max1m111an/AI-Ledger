export default async function ExecuteProtectedRequest<T>(
    request: () => Promise<T>,
): Promise<T> {
    return await request();
}
