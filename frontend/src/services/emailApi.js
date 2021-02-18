const EMAIL_API_URL = 'https://toggl-hire-frontend-homework.vercel.app/api';

const API_ERRORS = {
  send_failure: 'Error sending email to the following addresses',
  invalid_email_address: 'The following email addresses are not valid',
  server_error: 'The server reported an error. Please try again.',
};

export const sendEmails = (emails) =>
  new Promise((resolve, reject) => {
    fetch(`${EMAIL_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails }),
    })
      .then((response) => {
        if (response.ok) resolve(response);
        return response
          .json()
          .then(({ error, emails }) =>
            reject(`${API_ERRORS[error] || error} ${(emails || []).join(', ')}`)
          );
      })
      .catch((e) => console.log('oh no'));
  });
