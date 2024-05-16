import { minify } from 'uglify-js';

export default async function handler(req, res) {
  // Extract JavaScript code from request body
  const { code } = req.body;

  try {
    // Minify the JavaScript code
    const result = minify(code);

    // Send the minified code as a response
    res.status(200).json({ minifiedCode: result.code });
  } catch (error) {
    // Handle any errors that occur during minification
    res.status(500).json({ error: 'An error occurred during minification' });
  }
}

export async function GET() {
  return Response.json({ data: 'Hello World!' })
}
