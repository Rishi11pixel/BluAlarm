import smtplib
import os

from pathlib import Path

from email.mime.text import MIMEText

from dotenv import load_dotenv


env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)


EMAIL_USER = os.getenv("EMAIL_USER")

EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email_alert(
    receiver_email,
    subject,
    overall=None,
    preferred=None,
    route="Unknown Route",
    travel_date="Unknown Date"
):

    try:

        # -----------------------------------
        # HTML EMAIL TEMPLATE
        # -----------------------------------

        html = f"""

        <html>

        <body style="
            margin:0;
            padding:20px;
            background:#0a0e27;
            font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color:#f5f5f5;
        ">

        <div style="
            max-width:600px;
            margin:0 auto;
            background:#0f1729;
            border:1px solid rgba(34,211,238,0.1);
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 20px 60px rgba(0,0,0,0.3);
        ">

            <!-- ACCENT BAR -->

            <div style="
                height:3px;
                background:linear-gradient(90deg,#06b6d4 0%,#2563eb 50%,#06b6d4 100%);
            "></div>


            <!-- HEADER -->

            <div style="
                padding:40px 32px;
                border-bottom:1px solid rgba(255,255,255,0.03);
            ">

                <div style="
                    font-size:11px;
                    color:#67e8f9;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    margin-bottom:16px;
                    opacity:0.7;
                ">
                    Price Alert
                </div>

                <h1 style="
                    margin:0;
                    font-size:38px;
                    font-weight:700;
                    letter-spacing:-0.5px;
                    color:#ffffff;
                ">
                    BluAlarm
                </h1>

            </div>


            <!-- ROUTE SECTION -->

            <div style="
                padding:32px;
            ">

                <div style="
                    margin-bottom:32px;
                    padding-bottom:24px;
                    border-bottom:1px solid rgba(255,255,255,0.03);
                ">

                    <div style="
                        font-size:11px;
                        color:#64748b;
                        letter-spacing:1px;
                        text-transform:uppercase;
                        margin-bottom:12px;
                    ">
                        Route
                    </div>

                    <div style="
                        font-size:32px;
                        font-weight:700;
                        color:#ffffff;
                        margin-bottom:8px;
                    ">
                        {route}
                    </div>

                    <div style="
                        font-size:13px;
                        color:#94a3b8;
                    ">
                        📅 {travel_date}
                    </div>

                </div>


                <!-- OVERALL PRICE -->

                {
                    f'''
                    <div style="
                        background:linear-gradient(135deg,rgba(6,182,212,0.08) 0%,rgba(37,99,235,0.08) 100%);
                        border:1px solid rgba(34,211,238,0.15);
                        border-radius:16px;
                        padding:28px;
                        margin-bottom:24px;
                    ">

                        <div style="
                            font-size:11px;
                            color:#67e8f9;
                            letter-spacing:1px;
                            text-transform:uppercase;
                            margin-bottom:12px;
                            opacity:0.8;
                        ">
                            Cheapest Flight
                        </div>

                        <div style="
                            font-size:48px;
                            font-weight:700;
                            color:#ffffff;
                            letter-spacing:-1px;
                            margin-bottom:20px;
                        ">
                            ₹{overall["price"]}
                        </div>

                        <div style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:12px;
                        ">

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Airline
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {overall["airline"]}
                                </div>
                            </div>

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Departure
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {overall["departure"]}
                                </div>
                            </div>

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Arrival
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {overall["arrival"]}
                                </div>
                            </div>

                        </div>

                    </div>
                    '''
                    if overall else ""
                }


                <!-- PREFERRED PRICE -->

                {
                    f'''
                    <div style="
                        background:linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(168,85,247,0.08) 100%);
                        border:1px solid rgba(99,102,241,0.15);
                        border-radius:16px;
                        padding:28px;
                    ">

                        <div style="
                            font-size:11px;
                            color:#a5b4fc;
                            letter-spacing:1px;
                            text-transform:uppercase;
                            margin-bottom:12px;
                            opacity:0.8;
                        ">
                            Preferred Timing
                        </div>

                        <div style="
                            font-size:48px;
                            font-weight:700;
                            color:#ffffff;
                            letter-spacing:-1px;
                            margin-bottom:20px;
                        ">
                            ₹{preferred["price"]}
                        </div>

                        <div style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:12px;
                        ">

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Airline
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {preferred["airline"]}
                                </div>
                            </div>

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Departure
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {preferred["departure"]}
                                </div>
                            </div>

                            <div style="
                                background:rgba(255,255,255,0.02);
                                border-radius:12px;
                                padding:14px;
                            ">
                                <div style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:6px;
                                    text-transform:uppercase;
                                ">
                                    Arrival
                                </div>
                                <div style="
                                    font-size:15px;
                                    font-weight:600;
                                    color:#f5f5f5;
                                ">
                                    {preferred["arrival"]}
                                </div>
                            </div>

                        </div>

                    </div>
                    '''
                    if preferred else ""
                }

            </div>


            <!-- FOOTER -->

            <div style="
                padding:24px 32px;
                border-top:1px solid rgba(255,255,255,0.03);
                text-align:center;
                font-size:12px;
                color:#64748b;
            ">

                BluAlarm • Intelligent Flight Monitoring

            </div>

        </div>

        </body>

        </html>

        """

        msg = MIMEText(html, "html")

        msg["Subject"] = subject

        msg["From"] = EMAIL_USER

        msg["To"] = receiver_email

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            EMAIL_USER,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_USER,
            receiver_email,
            msg.as_string()
        )

        server.quit()

        print("HTML EMAIL SENT SUCCESSFULLY")


    except Exception as e:

        print("EMAIL ERROR:", e)