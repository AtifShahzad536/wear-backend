import { Router } from 'express';
import { config } from '../config/env.js';

const router = Router();

router.post('/customize', async (req, res) => {
  try {
    const { prompt, meshes, currentMeshStates, currentDecals, uploadedFiles, systemLogos, systemPatterns, history } = req.body;

    console.log('[AI Customize] Incoming prompt:', prompt);
    console.log('[AI Customize] systemPatterns count:', (systemPatterns || []).length, '| systemLogos count:', (systemLogos || []).length);
    console.log('[AI Customize] uploadedFiles count:', (uploadedFiles || []).length);
    console.log('[AI Customize] meshes:', (meshes || []).map(m => m.id));

    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      return res.status(400).json({ 
        error: 'Gemini API key is missing. Please add GEMINI_API_KEY to your .env file.' 
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Build the request body for Gemini API (Structured JSON output)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are a professional sportswear designer. Your task is to customize a 3D sports jersey/outfit model based on the user's design command.
You must return a JSON object with the exact updates to apply to the model's meshes AND the decals list.

CRITICAL — COMPLETENESS RULE (READ FIRST):
A single user prompt may mention MULTIPLE things at once — for example: colors + a pattern + a logo + text.
You MUST apply EVERY thing the user mentioned in that one prompt. Do not skip any of them.
- If the user mentions colors/gradients -> put them in "updates".
- If the user mentions a pattern (any word like "pattern", "print", "camo", "stripes", "checker", "texture", "graphic background") -> add a decal with type: "pattern" (see PATTERNS section).
- If the user mentions a logo (any word like "logo", "badge", "crest", "emblem", "brand", "team logo", or names a brand) -> add a decal with type: "image" (see LOGOS section).
- If the user mentions a name/number/text -> add a decal with type: "text".
Never return only some of these when the prompt asked for all of them. Silence on any part = failure.

MESH STATE FORMAT ("updates"):
- "color": Hex color string
- "isGrad": Boolean (true/false)
- "grad1": Hex color string for gradient start
- "grad2": Hex color string for gradient end
- "pColor": Hex color string for pattern tint color (only meaningful when a pattern decal is placed on that mesh)

You can customize in "updates":
1. Solid color ("color" and set "isGrad" to false).
2. Gradient ("grad1", "grad2" and set "isGrad" to true).
3. Pattern tint ("pColor") — only when a pattern decal is being placed on that same mesh.

NEVER put a pattern URL, image URL, or logo URL inside "updates". URLs go ONLY in the "decals" array (see below).

PATTERNS — ALWAYS APPLY AS A DECAL (NOT via updates):
Patterns are applied as interactive decal layers on this app. When the user asks for a pattern (of any kind), you MUST:
1. Pick a matching pattern from "System Default Patterns" (or use an "Attached Files" entry of type "pattern" when provided).
2. Emit an entry in "decals" with:
   - "type": "pattern"
   - "text": the pattern's name (from the list)
   - "imageUrl": the EXACT imageUrl string from the pattern list (this is REQUIRED — never omit it, never leave empty)
   - "meshId": the mesh to place it on (e.g. main body / front — match to an available mesh id)
   - "color": hex tint if the user specified one, otherwise "#ffffff"
Never try to express a pattern by only setting "pColor" — that alone will NOT render a pattern.

LOGOS — ALWAYS APPLY AS A DECAL:
When the user asks for a logo/badge/crest/emblem (or names a brand), you MUST:
1. Pick a matching logo from "System Default Logos" (or use an "Attached Files" entry of type "logo" when provided). If nothing matches by name, choose the closest match by name/category.
2. Emit an entry in "decals" with:
   - "type": "image"
   - "text": the logo's name (from the list)
   - "imageUrl": the EXACT imageUrl string from the logo list (this is REQUIRED — never omit it, never leave empty)
   - "meshId": the mesh to place it on (e.g. front chest / sleeve — match to an available mesh id)
   - "color": "#ffffff" unless the user asked to recolor the logo

TEXT DECALS:
For player names, team names, numbers, or sponsor texts, use type: "text".
- Match the "meshId" exactly to one of the available meshes where the text should be printed (e.g. if the user says back, select the mesh corresponding to the Back body panel).

DECAL POSITIONING & SCALE (CRITICAL):
When adding or updating decals (logos or text), you can set their scale and position on the mesh:
1. "decalScale": A number representing the size multiplier. Default is 0.15 for text, 0.12 for logos, 0.8 for patterns. If the user asks to make the text/logo/pattern bigger/larger/huge/increase size, double the scale (e.g. set decalScale to 0.24 or 0.3). If they say smaller/reduce size/tiny, decrease the scale (e.g. set decalScale to 0.06 or 0.08).
2. "position": Set this to position the decal on a specific part of the mesh. Supported values:
   - "center": Center of the panel (default)
   - "chest_left": Left chest (user's right side)
   - "chest_right": Right chest (user's left side)
   - "back_top": Upper back
   - "back_mid": Middle back
   - "back_bottom": Lower back
   - "left_sleeve": Left sleeve center
   - "right_sleeve": Right sleeve center

MODIFYING EXISTING LAYERS/DECALS:
You are provided with "Current Decals" which list already applied items on the model, each having a unique "id".
- If the user asks to modify an existing decal (e.g. "change the logo color to red", "make the name bigger", or "move the logo to the right chest"), return a decal item with action: "update", matching "id", and specify ONLY the updated fields (like color, text, meshId, decalScale, position).
- If the user asks to remove/delete a decal, return it with action: "delete" and matching "id".
- If you are creating a new decal, set action: "add" (or leave empty).

CRITICAL JSON RULES:
- Output MUST be valid RFC 8259 JSON.
- All keys and string values MUST use double quotes ("key": "value"), NOT single quotes.
- Absolutely NO trailing commas at the end of properties list or arrays.
- Respond with ONLY the JSON object.
- The keys in "updates" MUST EXACTLY match the IDs (including file extension, casing, and spaces) of the available meshes provided (e.g. "Cloth Mesh 1.obj"). Do NOT invent or guess mesh IDs.

The output must strictly follow this structure:
{
  "updates": {
    "MeshName.obj": {
      "color": "#HEX",
      "isGrad": false,
      "grad1": "#HEX",
      "grad2": "#HEX",
      "pColor": "#HEX"
    }
  },
  "decals": [
    {
      "action": "add/update/delete",
      "id": "existing-decal-id",
      "type": "text",
      "text": "PLAYER NAME",
      "meshId": "MeshName.obj",
      "color": "#HEX",
      "imageUrl": "http://...",
      "decalScale": 0.15
    }
  ],
  "explanation": "Brief description of the design decisions made."
}`;

    const promptText = `User Prompt: "${prompt}"

Conversation History:
${JSON.stringify(history || [], null, 2)}

Available Meshes to Customize:
${JSON.stringify(meshes, null, 2)}

Current Mesh States:
${JSON.stringify(currentMeshStates, null, 2)}

Current Decals (Already placed on model):
${JSON.stringify(currentDecals || [], null, 2)}

Attached Files (Attached by User for placement):
${JSON.stringify(uploadedFiles || [], null, 2)}

System Default Logos (Use if user asks for a preset logo):
${JSON.stringify(systemLogos || [], null, 2)}

System Default Patterns (Use if user asks for a preset pattern):
${JSON.stringify(systemPatterns || [], null, 2)}

Provide your design response strictly following the JSON format.`;

    // Dynamically build the schema properties based on available meshes
    const updatesPropertiesSchema = {};
    (meshes || []).forEach(m => {
      updatesPropertiesSchema[m.id] = {
        type: 'OBJECT',
        properties: {
          color: { type: 'STRING', description: 'Hex color value (e.g. #FF0000)' },
          isGrad: { type: 'BOOLEAN', description: 'Whether this mesh should use a gradient' },
          grad1: { type: 'STRING', description: 'Gradient start color hex value' },
          grad2: { type: 'STRING', description: 'Gradient end color hex value' },
          pColor: { type: 'STRING', description: 'Pattern overlay color hex value' }
        }
      };
    });

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              updates: {
                type: 'OBJECT',
                description: 'Object mapping active mesh IDs to their styling values.',
                properties: updatesPropertiesSchema
              },
              decals: {
                type: 'ARRAY',
                description: 'List of text or logo decals to add, update, or remove on the model.',
                items: {
                  type: 'OBJECT',
                  properties: {
                    action: { type: 'STRING', description: 'Action type: add, update, or delete' },
                    id: { type: 'STRING', description: 'The unique ID of the existing decal (required for update/delete)' },
                    type: { type: 'STRING', description: 'The decal type, e.g. text, image, or pattern' },
                    text: { type: 'STRING', description: 'The text value to display (or file name for image/pattern)' },
                    meshId: { type: 'STRING', description: 'The exact mesh ID to apply the decal to' },
                    color: { type: 'STRING', description: 'The hex color code for the text or pattern tint' },
                    imageUrl: { type: 'STRING', description: 'The uploaded file URL, required if type is image or pattern' },
                    decalScale: { type: 'NUMBER', description: 'Overall scale size multiplier (e.g., 0.15)' },
                    position: { type: 'STRING', description: 'Preset position on the mesh: center, chest_left, chest_right, back_top, back_mid, back_bottom, left_sleeve, right_sleeve' }
                  },
                  required: ['type', 'text', 'meshId', 'color']
                }
              },
              explanation: {
                type: 'STRING',
                description: 'Brief description of style decisions.'
              }
            },
            required: ['updates', 'explanation', 'decals']
          },
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // Safely parse the structured JSON from Gemini
    let cleanText = candidateText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }
    const designResponse = JSON.parse(cleanText);
    console.log('[AI Customize] Response updates keys:', Object.keys(designResponse.updates || {}));
    console.log('[AI Customize] Response decals:', JSON.stringify(designResponse.decals || [], null, 2));
    res.json(designResponse);
  } catch (error) {
    console.error('[AI Customize Error]:', error);
    res.status(500).json({ 
      error: 'Failed to generate customization.', 
      details: error.message 
    });
  }
});

export default router;
