export default async function handler(
    req: { method?: string; body?: any, headers?: any },
    res: { status: (code: number) => { json: (data: any) => any } }
) {
    // if (req.method !== "POST") {
    //     return res.status(405).json({
    //         error: "Method not allowed",
    //     });
    // }

    // make sure the user is logged in and valid
    // const token = req.headers["x-auth"];
    // if (!token) return res.status(401).json({ error: "Invalid user" });

    console.log("hello");
    return res.status(200).json({ ok: true });
}