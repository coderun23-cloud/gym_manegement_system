<!DOCTYPE html>
<html>
<head>
    <title>About Your Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #4f46e5; padding: 24px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 26px;">Hello, {{ $user->name }} 👋</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 28px; text-align: left; color: #333333;">
                            <p style="font-size: 16px; margin-bottom: 20px;">We regret to inform you that your account has been deleted from our system.</p>

                            <p style="font-size: 15px; margin-bottom: 16px;">
                                <strong>Reason for deletion:</strong><br>
                                <em style="color: #d32f2f;">{{ $reason->reason }}</em>
                            </p>

                            <p style="font-size: 15px; margin-bottom: 12px;">
                                If you believe this action was made in error, please reach out to our ICT support team.
                            </p>

                            <p style="font-size: 14px; margin-top: 24px; color: #666;">
                                Your registered email: <strong>{{ $user->email }}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f0f0f0; padding: 18px; text-align: center;">
                            <p style="font-size: 12px; color: #888888;">&copy; {{ date('Y') }} Mav Gym PLC. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
