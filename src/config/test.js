import dns from "node:dns/promises";

try {
    const result =
        await dns.resolveSrv(
            "_mongodb._tcp.agentic-auth.6r20n5h.mongodb.net"
        );

    console.log(result);
}
catch (err) {
    console.error(err);
}