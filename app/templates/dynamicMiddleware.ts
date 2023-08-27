import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse, userAgent } from 'next/server';

// initialize Supabase client - https://supabase.com/docs/reference/javascript/initializing
const supabaseUrl = 'https://tawrifvzyjqcddwuqjyq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// define a type for a variant
type Variant = {
  id: string;
  fileName: string;
  weight: number;
};

// middleware function to decide which variant to serve based on dynamic data from Supabase
export async function dynamicMiddleware(req: NextRequest) {
  // parse user agent to get device information per https://nextjs.org/docs/messages/middleware-parse-user-agent
  const { device } = userAgent(req);
  // check the deviceType
  const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';

  // select all variants per https://supabase.com/dashboard/project/tawrifvzyjqcddwuqjyq/api?resource=variants
  let { data: variants, error } = await supabase.from('variants').select('*');

  if (error || !variants) {
    console.error('Error fetching variants from Supabase:', error);
    // respond with a 500 status code in case of an error
    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }

  // logic to select a variant based on weight
  function chooseVariant(
    deviceType: 'mobile' | 'desktop',
    variants: Variant[]
  ): Variant {
    // sum all weights
    let totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    // generate random value to select variant
    let randomValue = Math.random() * totalWeight;

    for (const variant of variants) {
      if (randomValue < variant.weight) {
        return variant;
      }
      randomValue -= variant.weight;
    }

    // default to the first variant if none match
    return variants[0];
  }

  // check for existing cookie per https://nextjs.org/docs/app/api-reference/functions/next-request
  const variantID = req.cookies.get('variantID')?.toString();

  let chosenVariant;

  if (variantID) {
    // if cookie exists, select the variant based on ID
    chosenVariant = variants.find((v) => v.id === variantID);
  } else {
    // if no cookie, select based on weight & device type
    chosenVariant = chooseVariant(deviceType, variants);
  }

  // increment count for the chosen variant in Supabase
  // the increment function is defined in Functions under Database in supabase(https://supabase.com/dashboard/project/tawrifvzyjqcddwuqjyq/database/functions) per https://www.youtube.com/watch?v=n5j_mrSmpyc
  let { data, error: rpcError } = await supabase.rpc('increment', {
    row_id: chosenVariant.id,
  });

  if (rpcError) console.error(rpcError);
  else console.log(data);

  const res = NextResponse.rewrite(`/${chosenVariant.fileName}`);

  if (!variantID) {
    res.cookies.set('variantID', chosenVariant.id, {
      path: '/',
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60, //set it to 10 years
    });
  }

  return res;
}
