const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.log("BREVO_API_KEY not set");
  process.exit(1);
}

async function fetchLists() {
  const response = await fetch('https://api.brevo.com/v3/contacts/lists?limit=50&offset=0', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
    },
  });
  const data = await response.json();
  console.log("Brevo Lists:");
  if (data.lists) {
    data.lists.forEach(list => {
      console.log(`  ID: ${list.id} | Name: "${list.name}" | Folder: ${list.folderId} | Subscribers: ${list.totalSubscribers}`);
    });
  } else {
    console.log("Response:", JSON.stringify(data, null, 2));
  }
}

fetchLists().catch(err => console.error("Error:", err.message));
