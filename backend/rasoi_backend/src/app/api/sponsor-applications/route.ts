import { db } from '@/lib/db';
import { jsonOk, handleApiError } from '@/lib/api';
import { sponsorApplicationSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = sponsorApplicationSchema.parse(body);

    const application = await db.sponsorApplication.create({
      data: {
        companyName: input.companyName,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone,
        brandName: input.brandName,
        productDescription: input.productDescription,
        placementInterest: input.placementInterest,
        website: input.website,
        message: input.message,
        status: 'pending',
      },
    });

    return jsonOk(
      {
        id: application.id,
        message: 'Thank you. Our team will review your sponsorship application shortly.',
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
