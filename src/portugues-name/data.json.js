async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}
const limit = 100
const male = await json(`https://dados.justica.gov.pt/api/3/action/datastore_search?resource_id=46978bc6-fb8b-46b3-8732-643f8b90c64f&limit=${limit}`);
const female = await json(`https://dados.justica.gov.pt/api/3/action/datastore_search?resource_id=bfc781e5-524e-4fce-96e7-23f89cf6416c&limit=${limit}`);


process.stdout.write(JSON.stringify({
	male: male?.result.records,
	female: female?.result.records
}));