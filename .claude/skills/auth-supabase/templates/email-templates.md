# Supabase Email Templates

Custom email templates for Supabase authentication flows. These templates can be configured in the Supabase Dashboard under `Authentication > Email Templates`.

## Email Confirmation Template

**Subject:** Confirm your email address

```html
<h2>Confirm your email address</h2>

<p>Hi there!</p>

<p>Thank you for signing up for [Your App Name]. To complete your registration and access your account, please confirm your email address by clicking the button below:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
  Confirm Email Address
</a>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't create an account with [Your App Name], you can safely ignore this email.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

<p style="color: #6b7280; font-size: 12px;">
  [Your App Name] | [Company Address]<br>
  Questions? Contact us at [support@yourdomain.com]
</p>
```

### RTL Version (Arabic)

**Subject:** تأكيد عنوان بريدك الإلكتروني

```html
<div dir="rtl" style="font-family: 'Cairo', 'Segoe UI Arabic', sans-serif;">
  <h2>تأكيد عنوان بريدك الإلكتروني</h2>

  <p>مرحباً!</p>

  <p>شكراً لتسجيلك في [اسم التطبيق]. لإكمال التسجيل والوصول إلى حسابك، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
    تأكيد البريد الإلكتروني
  </a>

  <p>أو انسخ والصق هذا الرابط في متصفحك:</p>
  <p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

  <p>سينتهي صلاحية هذا الرابط خلال 24 ساعة.</p>

  <p>إذا لم تقم بإنشاء حساب في [اسم التطبيق]، يمكنك تجاهل هذا البريد بأمان.</p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

  <p style="color: #6b7280; font-size: 12px;">
    [اسم التطبيق] | [عنوان الشركة]<br>
    لديك أسئلة؟ تواصل معنا على [support@yourdomain.com]
  </p>
</div>
```

## Password Reset Template

**Subject:** Reset your password

```html
<h2>Reset your password</h2>

<p>Hi there!</p>

<p>We received a request to reset the password for your [Your App Name] account. Click the button below to create a new password:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
  Reset Password
</a>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour for security reasons.</p>

<p><strong>If you didn't request a password reset,</strong> you can safely ignore this email. Your password will not be changed.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

<p style="color: #6b7280; font-size: 12px;">
  [Your App Name] | [Company Address]<br>
  Questions? Contact us at [support@yourdomain.com]
</p>
```

### RTL Version (Arabic)

**Subject:** إعادة تعيين كلمة المرور

```html
<div dir="rtl" style="font-family: 'Cairo', 'Segoe UI Arabic', sans-serif;">
  <h2>إعادة تعيين كلمة المرور</h2>

  <p>مرحباً!</p>

  <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في [اسم التطبيق]. انقر على الزر أدناه لإنشاء كلمة مرور جديدة:</p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
    إعادة تعيين كلمة المرور
  </a>

  <p>أو انسخ والصق هذا الرابط في متصفحك:</p>
  <p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

  <p>سينتهي صلاحية هذا الرابط خلال ساعة واحدة لأسباب أمنية.</p>

  <p><strong>إذا لم تطلب إعادة تعيين كلمة المرور،</strong> يمكنك تجاهل هذا البريد بأمان. لن يتم تغيير كلمة المرور الخاصة بك.</p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

  <p style="color: #6b7280; font-size: 12px;">
    [اسم التطبيق] | [عنوان الشركة]<br>
    لديك أسئلة؟ تواصل معنا على [support@yourdomain.com]
  </p>
</div>
```

## Magic Link Template

**Subject:** Your magic link to sign in

```html
<h2>Sign in to [Your App Name]</h2>

<p>Hi there!</p>

<p>Click the button below to instantly sign in to your account. No password needed!</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
  Sign In
</a>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour and can only be used once.</p>

<p><strong>For your security:</strong> Only use this link if you requested it. If you didn't request this magic link, please ignore this email.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

<p style="color: #6b7280; font-size: 12px;">
  [Your App Name] | [Company Address]<br>
  Questions? Contact us at [support@yourdomain.com]
</p>
```

## Email Change Confirmation Template

**Subject:** Confirm your new email address

```html
<h2>Confirm your new email address</h2>

<p>Hi there!</p>

<p>We received a request to change the email address associated with your [Your App Name] account. To complete this change, please confirm your new email address by clicking the button below:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
  Confirm New Email
</a>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p><strong>Important:</strong> If you didn't request this email change, please contact our support team immediately at [support@yourdomain.com]. Your account security may be at risk.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

<p style="color: #6b7280; font-size: 12px;">
  [Your App Name] | [Company Address]<br>
  Questions? Contact us at [support@yourdomain.com]
</p>
```

## Supabase Template Variables

Available variables you can use in email templates:

- `{{ .Email }}` - The user's email address
- `{{ .Token }}` - The confirmation token
- `{{ .TokenHash }}` - The hashed token
- `{{ .ConfirmationURL }}` - The full confirmation URL with token
- `{{ .SiteURL }}` - Your application's site URL
- `{{ .RedirectTo }}` - The redirect URL after confirmation

## Custom Styling Tips

### 1. Responsive Design

```html
<style>
  @media only screen and (max-width: 600px) {
    .button {
      display: block !important;
      width: 100% !important;
    }
  }
</style>
```

### 2. Dark Mode Support

```html
<style>
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1f2937 !important;
      color: #f3f4f6 !important;
    }
  }
</style>
```

### 3. Brand Colors

```html
<!-- Primary Button -->
<a href="{{ .ConfirmationURL }}" 
   style="background-color: #your-brand-color;">
  Button Text
</a>

<!-- Secondary Text -->
<p style="color: #your-secondary-color;">
  Secondary information
</p>
```

## Testing Email Templates

### Using Supabase Dashboard

1. Go to `Authentication > Email Templates`
2. Select the template type
3. Edit the template
4. Use the "Send test email" feature
5. Check your inbox

### Local Testing with Inbucket

```bash
# Add to docker-compose.yml (if using local Supabase)
services:
  inbucket:
    image: inbucket/inbucket:latest
    ports:
      - '2500:2500' # SMTP
      - '9000:9000' # Web UI
```

Access test inbox at `http://localhost:9000`

## SMTP Configuration

### Using SendGrid

```bash
SUPABASE_SMTP_HOST=smtp.sendgrid.net
SUPABASE_SMTP_PORT=587
SUPABASE_SMTP_USER=apikey
SUPABASE_SMTP_PASS=SG.your-api-key
SUPABASE_SMTP_SENDER_EMAIL=noreply@yourdomain.com
```

### Using AWS SES

```bash
SUPABASE_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SUPABASE_SMTP_PORT=587
SUPABASE_SMTP_USER=your-smtp-username
SUPABASE_SMTP_PASS=your-smtp-password
SUPABASE_SMTP_SENDER_EMAIL=noreply@yourdomain.com
```

### Using Mailgun

```bash
SUPABASE_SMTP_HOST=smtp.mailgun.org
SUPABASE_SMTP_PORT=587
SUPABASE_SMTP_USER=postmaster@your-domain.mailgun.org
SUPABASE_SMTP_PASS=your-smtp-password
SUPABASE_SMTP_SENDER_EMAIL=noreply@yourdomain.com
```

## Email Deliverability Checklist

- [ ] SPF record configured for your domain
- [ ] DKIM signing enabled
- [ ] DMARC policy set up
- [ ] Sender domain verified with email provider
- [ ] "Reply-to" address configured
- [ ] Unsubscribe link included (for marketing emails)
- [ ] Plain text version provided
- [ ] Tested across major email clients (Gmail, Outlook, Apple Mail)
- [ ] Mobile responsive design
- [ ] Proper alt text for images
- [ ] Links use HTTPS

## Best Practices

1. **Keep it simple** - Avoid complex HTML/CSS
2. **Use inline styles** - Email clients strip out `<style>` tags
3. **Test thoroughly** - Different clients render differently
4. **Include plain text version** - For accessibility and spam filters
5. **Use absolute URLs** - For images and links
6. **Optimize images** - Keep file sizes small
7. **Clear call-to-action** - One primary action per email
8. **Security messaging** - Remind users to verify legitimate emails
9. **Expiration times** - Always communicate link expiration
10. **Support contact** - Provide easy way to get help

## Multilingual Support

For applications supporting multiple languages, use conditional logic:

```html
{% if .Locale == "ar" %}
  <!-- Arabic version -->
  <div dir="rtl">...</div>
{% elsif .Locale == "es" %}
  <!-- Spanish version -->
  <div>...</div>
{% else %}
  <!-- Default English version -->
  <div>...</div>
{% endif %}
```

Or maintain separate templates per language in Supabase Dashboard.

---

**Note:** Always test email templates across different email clients (Gmail, Outlook, Apple Mail, etc.) to ensure consistent rendering.