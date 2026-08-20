import { getStore } from "@netlify/blobs";

const STORE_NAME = "holy-live-leaderboard";

function cleanName(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

async function getEntries(store) {
  const { blobs } = await store.list({ prefix: "entry/" });
  const rows = await Promise.all(
    blobs.slice(-500).map(async ({ key }) => {
      try {
        return await store.get(key, { type: "json", consistency: "strong" });
      } catch {
        return null;
      }
    })
  );

  return rows
    .filter(Boolean)
    .sort((a, b) => {
      const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
      if (scoreDiff) return scoreDiff;
      return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    })
    .slice(0, 50);
}

export default async (req) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    const entries = await getEntries(store);
    return Response.json({ entries }, {
      headers: { "cache-control": "no-store" }
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = cleanName(body.name);
    const score = Math.max(0, Math.min(99999, Math.floor(Number(body.score) || 0)));

    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 });
    }

    // A completed run should be above this threshold. This is not intended
    // as anti-cheat security, only to keep accidental junk off the board.
    if (score < 19000) {
      return Response.json({ error: "Completion score required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const entry = {
      id,
      name,
      score,
      createdAt: new Date().toISOString()
    };

    await store.setJSON(`entry/${Date.now()}-${id}`, entry);

    const entries = await getEntries(store);
    return Response.json({ id, entries }, {
      status: 201,
      headers: { "cache-control": "no-store" }
    });
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { allow: "GET, POST" }
  });
};

export const config = {
  path: "/api/leaderboard"
};
