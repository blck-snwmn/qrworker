import { WorkerEntrypoint } from "cloudflare:workers";
import { zValidator } from "@hono/zod-validator";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { Hono } from "hono";
import QRCode from "qrcode";
import { z } from "zod";
//@ts-ignore
import resvgWasm from "./vendor/index_bg.wasm";

// initialize resvg
await initWasm(resvgWasm);

const schema = z.object({
	value: z.string().min(1).max(500),
	fitTo: z
		.object({
			mode: z.literal("original"),
		})
		.or(
			z.object({
				mode: z.literal("width"),
				value: z.number().int().positive(),
			}),
		),
});

type Schema = z.infer<typeof schema>;

async function generate(schema: Schema) {
	const { value, fitTo } = schema;
	const svg = await QRCode.toString(value, { type: "svg" });

	const resvg = new Resvg(svg, {
		fitTo: fitTo,
	});

	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();
	return pngBuffer;
}

export class GenerateService extends WorkerEntrypoint {
	async generate(profile: Schema) {
		schema.parse(profile);
		return await generate(profile);
	}
}

const app = new Hono();

app.post("/generate", zValidator("json", schema), async (c) => {
	const schema = c.req.valid("json");
	try {
		const pngBuffer = await generate(schema);
		return new Response(pngBuffer, {
			headers: {
				"Content-Type": "image/png",
			},
		});
	} catch (error) {
		console.error(error);
		return new Response("err", {
			status: 500,
		});
	}
});

export default app;
