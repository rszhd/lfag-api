## Overview

This sample implementation showcases how to use PROMPTMGR to generate coherent, structured long-form content by breaking down the generation process into manageable segments while maintaining context and flow throughout the document.

## Features

- Long-form content validation
- Content specification generation
- Segmented content generation with context awareness

## Usage

1. Create a `.env` file with the following variables:
```env
PORT=3000
NODE_ENV=development
LOG_ERROR=true
PROMPTMGR_SECRET_KEY=your_secret_key
PROMPTMGR_ENVIRONMENT=development
PROMPTMGR_PROJECT_ID=your_project_id
PROMPT_ID_DETERMINE_CONTENT_LENGTH=your_prompt_id
PROMPT_ID_GENERATE_CONTENT_SPECS=your_prompt_id
PROMPT_ID_GENERATE_CONTENT_SEGMENT=your_prompt_id
```

2. Start the server:
```bash
npm run dev:composeup
```

2. Make a POST request to `/api/content/generate` with the following body:
```json
{
  "instruction": "Your content generation instruction",
  "model": "gpt-4",
  "apiKey": "your_openai_api_key"
}
```

## Using PROMPTMGR Plugin

This functionality is also available as a PROMPTMGR plugin. To use it:

1. Navigate to your PROMPTMGR dashboard
2. Go to the Plugins section
3. Enable the Long Form Content Generation plugin
4. [Screenshot showing how to enable the plugin]
5. You can fork the prompts for customization

## How It Works

1. **Content Validation**: Determines if the request requires long-form content generation
2. **Specification Generation**: Creates a detailed content plan including structure and style
3. **Segmented Generation**: Generates content in segments while maintaining context
4. **Assembly**: Combines segments into a coherent final document

## Support

For support, please contact [contact@reqres.dev](mailto:contact@reqres.dev).
