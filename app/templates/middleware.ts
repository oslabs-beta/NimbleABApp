// importing required modules and types from the 'next/server' package
import { NextRequest, NextResponse, userAgent } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// importing the variants config from the JSON file
import variantsConfig from './nimble.config.json';
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
  const {ua} = userAgent(req);
  // console.log(data)
  function mobile_check(a){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) return true;
    else return false
  };

  // determine the device type, whether it's mobile or desktop
  const deviceType = mobile_check(ua) === true ? 'mobile' : 'desktop';

  const url = req.nextUrl;
  const currentPath = url.pathname;

  // find the experiment configuration for the current path
  const experimentConfig = variantsConfig.find(
    (config) => config.experiment_path === currentPath
  );

  // if no experiment configuration found for the current path, return the URL without any changes
  if (!experimentConfig || experimentConfig.device_type !== deviceType) {
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



  supabase
    .rpc('increment', { row_id: chosenVariant.id })
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
    `${currentPath}/variants/${chosenVariant.fileName}`
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

