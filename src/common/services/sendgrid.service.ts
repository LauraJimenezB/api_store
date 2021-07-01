import sendgrid = require('@sendgrid/mail');
import * as dotenv from 'dotenv';

dotenv.config();
sendgrid.setApiKey(process.env.API_KEY_SENDGRID);

export const sendEmailToken = (email: string, emailToken: string) => {
  const msg = {
    to: email,
    from: 'hope.acmu@gmail.com', // sender email
    subject: 'Confirm email',
    html: `https://book-store-challenge-nest.herokuapp.com/auth/${emailToken}/confirm`,
  };

  sendgrid.send(msg);
};
