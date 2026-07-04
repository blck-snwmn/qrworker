import { createExecutionContext, env, SELF, waitOnExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const payload = {
	value: "https://example.com",
	fitTo: { mode: "width", value: 128 },
};

async function expectPngResponse(response: Response) {
	expect(response.status).toBe(200);
	expect(response.headers.get("content-type")).toBe("image/png");

	const bytes = new Uint8Array(await response.arrayBuffer());
	expect(Array.from(bytes.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
}

describe("QR worker", () => {
	it("generates a QR PNG with the worker export", async () => {
		const request = new IncomingRequest("http://example.com/generate", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		await expectPngResponse(response);
	});

	it("generates a QR PNG through the worker runtime", async () => {
		const response = await SELF.fetch("https://example.com/generate", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		});
		await expectPngResponse(response);
	});
});
