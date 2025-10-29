import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendReviewEmail({ recipientEmail, businessName, reviewLink, customerName }) {
  if (!recipientEmail) {
    throw new Error("Recipient email is required.");
  }
  if (!reviewLink) {
    throw new Error("Review link is required.");
  }

  try {
    const response = await resend.emails.send({
      from: `${businessName} <reviews@clarksconstructioncompany.com>`,
      to: recipientEmail,
      subject: `Share Your Feedback About ${businessName}`,
      html: generateEmailTemplate({ 
        businessName, 
        reviewLink, 
        customerName: customerName || "Valued Customer" 
      }),
      text: generateTextTemplate({
        businessName,
        reviewLink,
        customerName: customerName || "Valued Customer"
      }),
      headers: {
        'X-Entity-Ref': `review-request-${Date.now()}`,
      },
    });
    
    return response;
  } catch (error) {
    throw new Error("Failed to send review email.");
  }
}

function generateEmailTemplate({ businessName, reviewLink, customerName }) {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Share Your Feedback</title>
    <style>
        /* Reset and Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background-color: #F7FAFC;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #0077B6 0%, #005691 100%);
            color: white;
            padding: 20px 15px;
            text-align: center;
            border-radius: 4px 4px 0 0;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        /* Content */
        .content {
            padding: 50px 40px;
            background: white;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
        }
        
        /* Typography */
        .greeting {
            color: #0077B6;
            margin: 0 0 25px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .paragraph {
            margin-bottom: 20px;
            font-size: 14px;
            color: #010611ff;
            line-height: 1.2;
            text-align:justify
        }
        
        .highlight {
            color: #2D3748;
            font-weight: 600;
        }
        
        /* CTA Section */
        .cta-section {
            text-align: center;
            margin: 35px 0;
            padding: 30px;
            background: linear-gradient(to right, #F7FAFC, #EDF2F7);
            border-radius: 12px;
            border: 1px solid #E2E8F0;
        }
        
        .stars {
            color: #FFC107;
            font-size: 28px;
            margin: 0 0 25px 0;
            letter-spacing: 6px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Button */
        .button {
            display: inline-block;
            padding: 12px 45px;
            background: linear-gradient(135deg, #0077B6 0%, #005691 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 400;
            font-size: 14px;
            margin: 8px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 119, 182, 0.3);
            border: none;
            cursor: pointer;
            text-align: center;
            min-width: 220px;
        }
        
        .button:hover {
            background: linear-gradient(135deg, #005691 0%, #004274 100%) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 119, 182, 0.4);
        }
        
        .button:active {
            transform: translateY(0);
            box-shadow: 0 2px 10px rgba(0, 119, 182, 0.3);
        }
        
        /* Divider */
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #E2E8F0, transparent);
            margin: 40px 0;
        }
        
        /* Note Section */
        .note {
            background: #FFF9E6;
            border-left: 4px solid #FFC107;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .note p {
            margin: 0;
            color: #744210;
            font-size: 14px;
            line-height: 1.6;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 40px 30px;
            color: #718096;
            font-size: 14px;
            line-height: 1.6;
            background: #F7FAFC;
            border-radius: 0 0 12px 12px;
        }
        
        .footer-links {
            margin: 20px 0;
        }
        
        .footer-link {
            color: #0077B6;
            text-decoration: none;
            margin: 0 10px;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: #005691;
            text-decoration: underline;
        }
        
        .copyright {
            margin: 15px 0 0 0;
            color: #A0AEC0;
            font-size: 13px;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 620px) {
            .email-container {
                width: 100% !important;
                border-radius: 0 !important;
            }
            
            .header {
                padding: 30px 20px !important;
                border-radius: 0 !important;
            }
            
            .header h1 {
                font-size: 20px !important;
            }
            
            .content {
                padding: 35px 25px !important;
                border-radius: 0 !important;
            }
            
            .greeting {
                font-size: 20px !important;
            }
            
            .cta-section {
                padding: 25px 20px !important;
                margin: 25px 0 !important;
            }
            
            .button {
                padding: 16px 35px !important;
                font-size: 15px !important;
                min-width: auto !important;
                width: 90% !important;
                max-width: 280px !important;
            }
            
            .stars {
                font-size: 24px !important;
                letter-spacing: 4px !important;
            }
            
            .footer {
                padding: 30px 20px !important;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background: #1A202C;
            }
            
            .content {
                background: #2D3748;
                color: #E2E8F0;
            }
            
            .paragraph {
                color: #E2E8F0;
            }
            
            .highlight {
                color: #FFFFFF;
            }
            
            .cta-section {
                background: #4A5568;
                border-color: #718096;
            }
        }
        
        /* Print styles */
        @media print {
            .email-container {
                box-shadow: none !important;
                margin: 0 !important;
                max-width: none !important;
            }
            
            .button {
                background: #000000 !important;
                color: #ffffff !important;
                box-shadow: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${businessName}</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Dear ${customerName},</h2>
            
            <p class="paragraph">
                Thank you for choosing <span class="highlight">${businessName}</span>. We're grateful for the opportunity to serve you and hope your experience exceeded expectations.
            </p>
            
            <p class="paragraph">
                Your feedback is invaluable in helping us maintain our commitment to excellence and continuously improve our services for customers like you.
            </p>
            
            <div class="cta-section">
                <div class="stars">★★★★★</div>
                <p class="paragraph" style="margin-bottom: 25px;">
                    Share your experience with others in our community
                </p>
                <a href="${reviewLink}" class="button">
                    Share Your Review
                </a>
                <p style="font-size: 14px; color: #718096; margin-top: 15px;">
                    Takes less than 2 minutes
                </p>
            </div>
            
            <p class="note">
                Your honest review helps future customers make informed decisions and allows us to recognize our team's outstanding work.
            </p>
            
            
            <div class="divider"></div>
            
            <p class="paragraph">
                With sincere appreciation,<br>
                <strong style="color: #0077B6;">The Team at ${businessName}</strong>
            </p>
        </div>
        
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Contact Us</a>
                <span style="color: #E2E8F0;">•</span>
                <a href="#" class="footer-link">Privacy Policy</a>
                <span style="color: #E2E8F0;">•</span>
                <a href="#" class="footer-link">Unsubscribe</a>
            </div>
            
            <p class="copyright">
                &copy; ${currentYear} ${businessName}. All rights reserved.<br>
                <span style="font-size: 12px; color: #A0AEC0;">
                    You are receiving this email because you recently conducted business with ${businessName}.
                </span>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

function generateTextTemplate({ businessName, reviewLink, customerName }) {
  const currentYear = new Date().getFullYear();
  
  return `
SHARE YOUR FEEDBACK ABOUT ${businessName.toUpperCase()}

Dear ${customerName},

Thank you for choosing ${businessName}. We're grateful for the opportunity to serve you and hope your experience exceeded expectations.

Your feedback is invaluable in helping us maintain our commitment to excellence and continuously improve our services for customers like you.

Share your experience with others in our community:

${reviewLink}

(Takes less than 2 minutes)

Your honest review helps future customers make informed decisions and allows us to recognize our team's outstanding work.

💡 Important: If you experienced any issues with our service, please contact us directly before leaving your review. We're committed to making things right.

With sincere appreciation,
The Team at ${businessName}

---
Contact Us • Privacy Policy • Unsubscribe
© ${currentYear} ${businessName}. All rights reserved.

You are receiving this email because you recently conducted business with ${businessName}.
  `;
}