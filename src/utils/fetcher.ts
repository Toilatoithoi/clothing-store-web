export const fetcher = (key: string) => fetch(`${process.env.ENDPOINT}${key}`).then(res => res.json());
