using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace PriceTrackerApp.MailUtils
{
    public static class MailSender
    {
        public static void MakeEmail(string toAddress, string itemName, string price, 
            string itemUrl, string vendor)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(MailConfig.SendAddress);
            email.To.Add(MailboxAddress.Parse(toAddress));
            email.Subject = "Test Email Subject";
            email.Body = new TextPart(TextFormat.Html){Text = MessageBody(itemName,
                price,itemUrl,vendor)};

            using var smtp= new SmtpClient();
            smtp.CheckCertificateRevocation = false;
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(MailConfig.SendAddress, MailConfig.SendPass);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

        public static string MessageBody(string itemName, string price, 
            string itemUrl, string vendor)
        {
            return "<h1 style=\"color:#003fa3\">" + itemName + "</h1>" +
                "<h4>is now $" + price + "</h4>" +
                "see the listing on <a href=\""+itemUrl+"\">"+vendor+"</a>"+
                "<br/></br><p>PriceTracker</p>";
        }
    }
}
