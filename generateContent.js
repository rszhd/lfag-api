import dotenv from 'dotenv';
import PromptManager from 'promptmgr-sdk';

dotenv.config();

const promptManager = new PromptManager({
  baseUrl: `${process.env.PROMPTMGR_API_URL}/api/service`,
  secretKey: process.env.PROMPTMGR_SECRET_KEY,
  environment: process.env.PROMPTMGR_ENVIRONMENT,
  projectId: process.env.PROMPTMGR_PROJECT_ID
});

const validateApiKeyRequirement = (model, apiKey) => {
  if (model !== 'gpt-4o-mini' && !apiKey) {
    throw createError(400, 'Insert your OpenAI API key to use another model.');
  }
};

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const validateLongFormContent = async (instruction, modelSettings) => {
  const result = await promptManager.run({
    promptId: process.env.PROMPT_ID_DETERMINE_CONTENT_LENGTH,
    action: 'determineContentLength',
    modelSettings,
    variables: [{ field: 'instruction', value: instruction }]
  });

  const isLongForm = JSON.parse(result?.response)?.is_long_form_content;
  if (!isLongForm) {
    throw createError(400, 'Not a long form content');
  }
};

const getContentSpecifications = async (instruction, modelSettings) => {
  const result = await promptManager.run({
    promptId: process.env.PROMPT_ID_GENERATE_CONTENT_SPECS,
    action: 'generateContentSpecs',
    modelSettings,
    variables: [{ field: 'instruction', value: instruction }]
  });
  
  return JSON.parse(result?.response);
};

const prepareContentVariables = (contentSpecs, segmentIndex, previousContent) => {
  return [
    { field: 'contentType', value: contentSpecs.contentType },
    { field: 'topic', value: contentSpecs.topic },
    { field: 'totalLength', value: contentSpecs.totalLength },
    { field: 'numberOfSegments', value: contentSpecs.segments.length },
    { field: 'toneStyle', value: contentSpecs.toneStyle },
    { field: 'targetAudience', value: contentSpecs.targetAudience },
    { field: 'mainPoints', value: contentSpecs.segments.map(segment => `- ${segment.segmentTitle}`).join('\n') },
    { field: 'styleGuideLanguage', value: contentSpecs.styleGuide.language },
    { field: 'styleGuideFormatting', value: contentSpecs.styleGuide.formatting.map(format => `- ${format}`).join('\n') },
    { field: 'segmentLength', value: contentSpecs.segmentLength },
    { field: 'keyPoints', value: contentSpecs.segments[segmentIndex].keyPoints.join(', ') },
    { field: 'previousContent', value: previousContent },
    { field: 'isFirst', value: segmentIndex === 0 },
    { field: 'isLast', value: segmentIndex + 1 === contentSpecs.segments.length },
    { field: 'segmentNumber', value: segmentIndex + 1 }
  ];
};

const generateContentSegment = async (contentSpecs, segmentIndex, previousContent, modelSettings) => {
  const variables = prepareContentVariables(contentSpecs, segmentIndex, previousContent);
  const result = await promptManager.run({
    promptId: process.env.PROMPT_ID_GENERATE_CONTENT_SEGMENT,
    action: 'generateContentSegment',
    modelSettings,
    variables
  });
  
  return result.response;
};

const generateContent = async (req, res, next) => {
  const { instruction, model, apiKey } = req.body;
  const fullContent = [''];
  const modelSettings = { apiKey, model };

  try {
    validateApiKeyRequirement(model, apiKey);
    await validateLongFormContent(instruction, modelSettings);
    
    const contentSpecs = await getContentSpecifications(instruction, modelSettings);
    let previousContent = null;

    for (let i = 0; i < contentSpecs.segments.length; i++) {
      const segmentContent = await generateContentSegment(
        contentSpecs, 
        i, 
        previousContent, 
        modelSettings
      );
      
      fullContent.push(segmentContent);
      previousContent = segmentContent;
    }

    return res.status(200).json({
      isSuccess: true,
      data: { content: fullContent.join('\n\n') }
    });
    
  } catch (error) {
    next(error);
  }
};

export default generateContent;
