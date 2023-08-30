import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse, userAgent } from 'next/server';

// setting up the Supabase client with the given URL and API key - https://supabase.com/docs/reference/javascript/initializing
const supabaseUrl = 'https://tawrifvzyjqcddwuqjyq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// define a type for a variant
type Variant = {
  id: string;
  fileName: string;
  weight: number;
  experiment_id: string;
};

// middleware function to decide which variant to serve based on dynamic data from Supabase
export async function dynamicMiddleware(req: NextRequest) {
  // parse user agent to get device information per https://nextjs.org/docs/messages/middleware-parse-user-agent
  const { device } = userAgent(req);
  // check the deviceType
  const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';

  // extract the experiment ID from the request query, if present
  const experimentId: string | undefined = req.nextUrl.query.experimentId;

  let results;

  if (experimentId) {
    // if the user has selected a specific experiment fetch that specific experiment
    let { data, error } = await supabase
      .from('experiment')
      .select('*, variants (*)')
      .eq('id', experimentId);
    if (error || !data) {
      console.error('Error fetching experiment by ID:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
    results = data;
  } else {
    // otherwise fetch experiments based on device type
    let { data, error } = await supabase
      .from('experiment')
      .select('*, variants (*)')
      .eq('device_type', deviceType);
    if (error || !data) {
      console.error('Error fetching experiments by device type:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
    results = data;
  }

  // select the first experiment from the fetched results
  const currentExperiment = results[0];
  // extract all variants for the current experiment
  const variants = currentExperiment.variants;

  // logic to select a variant based on weight
  function chooseVariant(variants: Variant[]): Variant {
    // calculate the total weight of all variants
    let totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    // generate a random number within the range of the total weight
    let randomValue = Math.random() * totalWeight;

    // iterate through the variants to find which variant the random number falls into
    for (const variant of variants) {
      if (randomValue < variant.weight) {
        return variant;
      }
      randomValue -= variant.weight;
    }

    // default to the first variant if none matches
    return variants[0];
  }

  // check for existing cookie per https://nextjs.org/docs/app/api-reference/functions/next-request
  const variantCookie = req.cookies.get('variantID');
  const cookieID = variantCookie
    ? `${currentExperiment.id}_${variantCookie}`
    : null;

  let chosenVariant;

  if (cookieID) {
    // if cookie exists, find and select the variant based on ID
    chosenVariant = variants.find(
      (v) => `${currentExperiment.id}_${v.id}` === cookieID
    );
  } else {
    // if no cookie, select a variant based on weight & device type
    chosenVariant = chooseVariant(variants);
  }

  // increase the count for the chosen variant in Supabase
  // the increment function is defined in Functions under Database in supabase(https://supabase.com/dashboard/project/tawrifvzyjqcddwuqjyq/database/functions) per https://www.youtube.com/watch?v=n5j_mrSmpyc
  let { data, error } = await supabase.rpc('increment', {
    row_id: chosenVariant.id,
  });

  if (error) console.error(error);
  else console.log(data);

  // rewrite the response to serve the selected variant's file
  const res = NextResponse.rewrite(`/${chosenVariant.fileName}`);

  // if the user doesn't have a cookie, set one indicating their chosen variant
  if (!cookieID) {
    res.cookies.set(
      'variantID',
      `${currentExperiment.id}_${chosenVariant.id}`,
      {
        path: '/',
        httpOnly: true,
        maxAge: 10 * 365 * 24 * 60 * 60, //set it to 10 years
      }
    );
  }

  return res;
}
