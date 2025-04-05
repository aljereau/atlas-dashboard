import { serialize } from 'cookie';

// Set your password here - change this to something more secure
const PASSWORD = 'atlas-dashboard-2025';

export default function handler(req, res) {
  // Check if this is the password submission
  if (req.method === 'POST') {
    const { password } = req.body;
    
    if (password === PASSWORD) {
      // Set a cookie to indicate successful authentication
      res.setHeader(
        'Set-Cookie',
        serialize('auth', 'true', { 
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        })
      );
      
      // Add the bypass header for Vercel's protection
      res.setHeader('x-vercel-protection-bypass', 'true');
      
      // Redirect to the main page
      res.redirect(307, '/');
      return;
    } else {
      // Wrong password, show error message
      return res.status(401).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Access Denied</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
              }
              .container {
                max-width: 400px;
                padding: 30px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
              }
              h1 { color: #e63946; margin-top: 0; }
              form { margin-top: 20px; }
              input {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
              }
              button {
                background-color: #0070f3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
              }
              button:hover { background-color: #0051cc; }
              .error { color: #e63946; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Access Denied</h1>
              <p class="error">Incorrect password. Please try again.</p>
              <form method="POST" action="/api/auth">
                <input type="password" name="password" placeholder="Enter password" required />
                <button type="submit">Submit</button>
              </form>
            </div>
          </body>
        </html>
      `);
    }
  }
  
  // Check if the user is already authenticated via cookie
  if (req.cookies && req.cookies.auth === 'true') {
    // User is authenticated, add the bypass header
    res.setHeader('x-vercel-protection-bypass', 'true');
    
    // Redirect to the main page
    res.redirect(307, '/');
    return;
  }
  
  // If not authenticated, show the password form
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Atlas Dashboard - Private Access</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            max-width: 400px;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          .logo {
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 24px;
            color: #0070f3;
          }
          h1 { margin-top: 0; }
          p { margin-bottom: 25px; line-height: 1.5; }
          form { margin-top: 20px; }
          input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
          button {
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover { background-color: #0051cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">ATLAS DASHBOARD</div>
          <h1>Private Access</h1>
          <p>This dashboard is password protected. Please enter the password to continue.</p>
          <form method="POST" action="/api/auth">
            <input type="password" name="password" placeholder="Enter password" required />
            <button type="submit">Access Dashboard</button>
          </form>
        </div>
      </body>
    </html>
  `);
} 