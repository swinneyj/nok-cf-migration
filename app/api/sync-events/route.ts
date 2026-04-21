import { NextRequest, NextResponse } from 'next/server';
import { syncVenuesBySlug } from '@/lib/db/syncEvents';
import { clearEventCache } from '@/lib/getCachedVenueEvents';

export const maxDuration = 300;

function parseVenueSlugs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean);
  }

  return [];
}

export async function POST(request: NextRequest) {
  console.log('[SYNC] POST request received');

  // Verify secret key for security
  const authHeader = request.headers.get('authorization');
  const syncSecret = process.env.SYNC_SECRET_KEY;

  if (!syncSecret) {
    console.error('[SYNC] SYNC_SECRET_KEY not configured');
    return NextResponse.json({
      success: false,
      error: 'Server misconfiguration',
    }, { status: 500 });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({
      success: false,
      error: 'Missing or invalid authorization',
    }, { status: 401 });
  }

  const token = authHeader.substring(7);
  if (token !== syncSecret) {
    return NextResponse.json({
      success: false,
      error: 'Invalid secret key',
    }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const venueSlugs = parseVenueSlugs((body as any).venueSlugs);
    const monthsAhead = Number.parseInt(String((body as any).monthsAhead ?? '3'), 10);

    if (venueSlugs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Provide venueSlugs (array or comma-separated string).',
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(monthsAhead) || monthsAhead < 1 || monthsAhead > 12) {
      return NextResponse.json(
        {
          success: false,
          error: 'monthsAhead must be between 1 and 12.',
        },
        { status: 400 }
      );
    }

    if (venueSlugs.length > 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limit venueSlugs to 3 per request to avoid timeouts.',
        },
        { status: 400 }
      );
    }

    console.log('[SYNC] Starting targeted sync...', { venueSlugs, monthsAhead });
    const result = await syncVenuesBySlug(venueSlugs, monthsAhead);
    console.log('[SYNC] Targeted sync completed:', result);

    // Clear the event cache so the API returns fresh data from the database
    clearEventCache();

    return NextResponse.json({
      success: true,
      message: 'Targeted event sync completed',
      data: result,
    });
  } catch (error) {
    console.error('[SYNC] Error during sync:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to /api/sync-events to run a targeted sync',
    exampleBody: {
      venueSlugs: ['stadium-swim', 'drais-nightclub'],
      monthsAhead: 3,
    },
  });
}
