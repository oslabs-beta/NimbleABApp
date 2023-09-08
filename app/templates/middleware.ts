// importing required modules and types from the 'next/server' package
import { NextRequest, NextResponse, userAgent } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// importing the variants config from the JSON file
import variantsConfig from './staticConfig.json';
import { NextURL } from 'next/dist/server/web/next-url';
import { v4 as uuidv4 } from 'uuid';
import { ChildProcess } from 'child_process';

// initialize Supabase client - https://supabase.com/docs/reference/javascript/initializing
const supabaseUrl = 'https://tawrifvzyjqcddwuqjyq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw';
const supabase = createClient(supabaseUrl, supabaseKey);

//initialize experiment - only input f
// const experiment = variants.filter("exper")

// defining a type for the variant with properties: id, fileName, and weight

type Variant = {
  id: string;
  fileName: string;
  weight: number;
  // experiment_id: string;
};

// export const config = {
//   matcher: '/blog', //experiment path
// };

// middleware function that determines which variant to serve based on device type and possibly cookie values
export async function middleware(req: NextRequest) {
  // extract the device details from the user agent of the request - https://nextjs.org/docs/messages/middleware-parse-user-agent
  const { device } = userAgent(req);

  // determine the device type, whether it's mobile or desktop
  const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';

  const url = req.nextUrl;
  const currentPath = url.pathname;

  // find the experiment configuration for the current path
  const experimentConfig = variantsConfig.find(
    (config) => config.experiment_path === currentPath
  );

  // if no experiment configuration found for the current path, return the URL without any changes
  if (!experimentConfig) {
    return NextResponse.rewrite(url);
  }

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

  // // check for existing cookie
  // const expVariantID = req.cookies.get('expVariantID')?.value;

  // // choose an experiment and then a variant inside the experiment
  // const experiment = variantsConfig.filter(
  //   (experiments) => experiments.experiment_name === 'test1'
  // );

  // const experimentId = experiment[0].experiment_id; //change string based on test name
  // // console.log(experimentId);

  const experimentId = experimentConfig.experiment_id;
  const expVariantID = req.cookies.get('expVariantID')?.value;

  // prioritize experiment selection via query parameter
  // first check if a variant has been selected based on the expVariantID cookie
  // if not, then choose a variant based on the device type and the weights of the available variants

  let chosenExperiment: string = expVariantID
    ? expVariantID?.split('_')[0]
    : experimentId;
  // console.log('chosenExperiment :>> ', chosenExperiment);

  async function getVariant(
    experimentConfig: any,
    varID: string
  ): Promise<Variant> {
    // console.log(experiment[0].variants);
    // return experiment[0].variants.filter((variant) => variant.id === varID)[0];
    return experimentConfig.variants.filter(
      (variant: { id: string }) => variant.id === varID
    )[0];
  }
  // if (expVariantID) console.log(getVariant(expVariantID?.split('_')[1]));

  // let chosenVariant: Variant = expVariantID
  //   ? await getVariant(expVariantID.split('_')[1])
  //   : chooseVariant(deviceType, experiment[0].variants);

  let chosenVariant: Variant = expVariantID
    ? await getVariant(experimentConfig, expVariantID.split('_')[1])
    : chooseVariant(deviceType, experimentConfig.variants);

  // console.log('chosenVariant :>> ', chosenVariant);
  // asynchronously call the increment RPC function in Supabase without waiting for it to complete
  // create a separate static_variants table and static_increment function for the staticConfig (https://supabase.com/dashboard/project/tawrifvzyjqcddwuqjyq/database/functions) per https://www.youtube.com/watch?v=n5j_mrSmpyc

  await supabase.from('static_variants').upsert(
    {
      id: chosenVariant.id,
      fileName: chosenVariant.fileName,
      weight: chosenVariant.weight,
      experiment_id: experimentId,
    },
    { onConflict: 'id' }
  );

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

  // const url = req.nextUrl;
  // url.pathname = url.pathname.replace(
  //   '/blog',
  //   `/blog/${chosenVariant.fileName}`
  // );

  url.pathname = url.pathname.replace(
    currentPath,
    `${currentPath}/${chosenVariant.fileName}`
  );

  const res = NextResponse.rewrite(url);

  // if the variant ID doesn't exist in the cookies, set it now for future requests
  if (!expVariantID) {
    res.cookies.set('expVariantID', `${experimentId}_${chosenVariant.id}`, {
      path: '/',
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60, // set the cookie to expire in 10 years
    });
  }

  // return the response with the rewritten url or any set cookies
  return res;
}
