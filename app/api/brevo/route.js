import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
  }

  const { action, email, name, attributes, listIds } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    if (action === 'create_contact') {
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
        if (errorData.code === 'duplicate_parameter') {
          return NextResponse.json({ success: true, message: 'Contact already exists' });
        }
        console.error('Brevo API error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Brevo API error' }, { status: response.status });
      }

      return NextResponse.json({ success: true });

    } else if (action === 'send_event') {
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
          return NextResponse.json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Brevo API error' }, { status: response.status });
      }

      return NextResponse.json({ success: true });

    } else if (action === 'notify_coming_soon') {
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
          return NextResponse.json({ success: true });
        }
        console.error('Brevo API error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Brevo API error' }, { status: response.status });
      }

      return NextResponse.json({ success: true });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Brevo integration error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
