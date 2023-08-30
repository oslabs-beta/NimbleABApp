// importing required modules and types from the 'next/server' package
import { NextRequest, NextResponse, userAgent } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// importing the variants config from the JSON file
import variantsConfig from './staticConfig.json';

// initialize Supabase client - https://supabase.com/docs/reference/javascript/initializing
const supabaseUrl = 'https://tawrifvzyjqcddwuqjyq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// defining a type for the variant with properties: id, fileName, and weight
type Variant = {
  id: string;
  fileName: string;
  weight: number;
  experiment_id: string;
};

// middleware function that determines which variant to serve based on device type and possibly cookie values
export async function staticMiddleware(req: NextRequest) {
  // extract the device details from the user agent of the request - https://nextjs.org/docs/messages/middleware-parse-user-agent
  const { device } = userAgent(req);

  // determine the device type, whether it's mobile or desktop
  const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';

  // function to choose a variant based on device type and weights of available variants
  function chooseVariant(
    deviceType: 'mobile' | 'desktop',
    variants: Variant[]
  ): Variant {
    // calculate the total weight of all variants
    let totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

    // generate a random value within the range of the total weight
    let randomValue = Math.random() * totalWeight;

    // loop through variants to find a matching variant based on its weight
    for (const variant of variants) {
      if (randomValue < variant.weight) {
        return variant;
      }
      randomValue -= variant.weight;
    }

    // default to the first variant if no variant is matched
    return variants[0];
  }

  // check for existing cookie
  const expVariantID = req.cookies.get('expVariantID')?.toString();

  // choose an experiment and then a variant inside the experiment
  const experimentId = req.nextUrl.query.experimentId;
  let chosenExperiment;

  // prioritize experiment selection via query parameter
  // first check if a variant has been selected based on the expVariantID cookie
  // if not, then choose a variant based on the device type and the weights of the available variants
  if (experimentId) {
    chosenExperiment =
      variantsConfig.find((e) => e.experiment_id === experimentId) ||
      variantsConfig[0];
  } else if (expVariantID) {
    const [experimentID] = expVariantID.split('_');
    chosenExperiment =
      variantsConfig.find((e) => e.experiment_id === experimentID) ||
      variantsConfig[0];
  } else {
    chosenExperiment = variantsConfig[0];
  }

  let chosenVariant;

  if (expVariantID) {
    const [, variantID] = expVariantID.split('_');
    if (chosenExperiment) {
      chosenVariant = chosenExperiment.variants.find((v) => v.id === variantID);
    }
  }

  if (!chosenVariant) {
    chosenVariant = chooseVariant(deviceType, chosenExperiment.variants);
  }
  // asynchronously call the increment RPC function in Supabase without waiting for it to complete
  // create a separate static_variants table and static_increment function for the staticConfig (https://supabase.com/dashboard/project/tawrifvzyjqcddwuqjyq/database/functions) per https://www.youtube.com/watch?v=n5j_mrSmpyc
  supabase
    .rpc('static_increment', { row_id: chosenVariant.id })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error incrementing variant count:', error);
      } else {
        console.log(data);
      }
    });

  // rewrite the request to serve the chosen variant's file
  const res = NextResponse.rewrite(`/${chosenVariant.fileName}`);

  // if the variant ID doesn't exist in the cookies, set it now for future requests
  if (!expVariantID) {
    res.cookies.set(
      'expVariantID',
      `${chosenExperiment.experiment_id}_${chosenVariant.id}`,
      {
        path: '/',
        httpOnly: true,
        maxAge: 10 * 365 * 24 * 60 * 60, // set the cookie to expire in 10 years
      }
    );
  }

  // return the response with the rewritten url or any set cookies
  return res;
}
