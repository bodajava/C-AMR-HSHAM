export const emailTemplet = async ({ code, title } : {code:number | string , title : string}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || "Verification Code"}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }

        .header {
            padding: 40px 30px 20px;
            text-align: center;
        }

        .logo {
            height: 48px;
            width: auto;
            margin-bottom: 20px;
        }

        .content {
            padding: 0 40px 40px;
            text-align: center;
            color: #1e293b;
        }

        .content h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #0f172a;
            letter-spacing: -0.025em;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }

        .otp-container {
            margin: 32px 0;
            padding: 24px;
            background-color: #f1f5f9;
            border-radius: 16px;
            border: 2px dashed #cbd5e1;
        }

        .otp-code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 0.25em;
            color: #0d9488;
            margin: 0;
        }

        .info-box {
            background-color: #f0fdfa;
            border-left: 4px solid #0d9488;
            padding: 16px;
            margin-bottom: 24px;
            text-align: left;
        }

        .info-box p {
            font-size: 14px;
            margin: 0;
            color: #115e59;
        }

        .footer {
            padding: 32px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            font-size: 14px;
            color: #64748b;
            margin: 4px 0;
        }

        .social-links {
            margin-top: 16px;
        }

        .social-links a {
            color: #0d9488;
            text-decoration: none;
            margin: 0 8px;
            font-weight: 600;
            font-size: 13px;
        }

        @media screen and (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 0 24px 32px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="https://c-amr-hsham.vercel.app/logo.png" alt="Captain Amr Gym" class="logo">
            </div>

            <div class="content">
                <h1>${title || "Confirm Your Email Change"}</h1>
                <p>Hello,</p>
                <p>
                    You're updating your account with <strong>Captain Amr Gym</strong>. 
                    To ensure it's really you and keep your transformation journey secure, please use the verification code below.
                </p>

                <div class="otp-container">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px; font-weight: 600;">Your Verification Code</p>
                    <div class="otp-code">${code}</div>
                </div>

                <div class="info-box">
                    <p>
                        <strong>Note:</strong> This code will expire in <strong>10 minutes</strong>. 
                        If you didn't request this change, please ignore this email or contact our support team.
                    </p>
                </div>

                <p style="font-size: 14px; color: #94a3b8;">
                    Let's get you back to reaching your peak performance!
                </p>
            </div>

            <div class="footer">
                <p><strong>Captain Amr Gym</strong></p>
                <p>Precision Training & Data-Driven Nutrition</p>
                <p>© ${new Date().getFullYear()} PlusBeat. All rights reserved.</p>
                <div class="social-links">
                    <a href="https://c-amr-hsham.vercel.app">Website</a>
                    <a href="#">Instagram</a>
                    <a href="#">Support</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
}