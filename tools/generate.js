const {generateTemplateFiles} = require('generate-template-files');
const config = require('../package.json');

const commonQuestions = [
  { 
    question: 'What type of object (singular) is the adapter for? (e.g. form, video, meeting, chat)', 
    slot: '__object_singular__' 
  },
  { 
    question: 'What platform/brand is the object hosted by? (e.g. Vimeo, HubSpot, Marketo)', 
    slot: '__platform__' 
  },
  {
    question: 'Author',
    slot: '__author__'
  }
];

const dynamicReplacers = [
  {
    slot: '__repository_home__',
    slotValue: config.homepage
  }
];

const output = {
  path: './adapters/__platform__(pascalCase)/__object_singular__(kebabCase).js',
  pathAndFileNameDefaultCase: '(noCase)',
};

const onCompleteCallback = (results) => {
  console.log(results);
};
 
generateTemplateFiles([
  {
    option: 'postMessage Listener',
    entry: {
      folderPath: './tools/templates/postMessage/__object_singular__.js',
    },
    stringReplacers: commonQuestions,
    dynamicReplacers: dynamicReplacers,
    output: output,
    onComplete: onCompleteCallback,
  },
  {
    option: 'IIFE',
    entry: {
      folderPath: './tools/templates/IIFE/__object_singular__.js',
    },
    stringReplacers: commonQuestions,
    dynamicReplacers: dynamicReplacers,
    output: output,
    onComplete: onCompleteCallback,
  },
  {
    option: 'Only Comments',
    entry: {
      folderPath: './tools/templates/blank/__object_singular__.js',
    },
    stringReplacers: commonQuestions,
    dynamicReplacers: dynamicReplacers,
    output: output,
    onComplete: onCompleteCallback,
  }
]);