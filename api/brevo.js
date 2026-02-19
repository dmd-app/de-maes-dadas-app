export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Brevo API key not configured' });
  }

  const { action, email, name, attributes, listIds } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    if (action === 'create_contact') {
      // Create or update a contact in Brevo
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name || '',
            SOURCE: 'app_demaesdadas',
            ...attributes,
          },
          listIds: listIds || [2],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // "duplicate_parameter" means contact already exists, which is fine with updateEnabled
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true, message: 'Contact already exists' });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'send_event') {
      // Track an event for the contact (e.g., post created, coming soon interest)
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            ...attributes,
          },
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else if (action === 'notify_coming_soon') {
      // Add contact interested in "coming soon" features to a specific list
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          attributes: {
            SOURCE: 'coming_soon_notify',
            COMING_SOON_INTEREST: true,
          },
          listIds: listIds || [3],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'duplicate_parameter') {
          return res.status(200).json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Brevo integration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
