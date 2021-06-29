import sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.API_KEY);

export const sendEmailToken = (email: string, emailToken: string) => {
  const msg = {
    to: email,
    from: 'hope.acmu@gmail.com', // Use the email address or domain you verified above
    subject: 'Confirm email',
    html: `http://localhost:3000/auth/${emailToken}/confirm`,
  };

  sendgrid.send(msg);
};
