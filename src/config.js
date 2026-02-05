// Personalize these via environment variables.
// Set them in .env.local for local dev, or in your hosting dashboard for production.
export const NAMES = {
  sender: import.meta.env.VITE_SENDER_NAME || 'Prateek',
  recipient: import.meta.env.VITE_RECIPIENT_NAME || 'Akshita',
  petname: import.meta.env.VITE_RECIPIENT_PETNAME || 'Cutakshita',
  recipientFull: import.meta.env.VITE_RECIPIENT_FULL_NAME || 'Akshita Sharma',
};

// Secret passphrase the recipient must enter to start the game.
export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'ComeToDaddy';

// The banner question displayed on the runway backdrop.
export const BANNER_TEXT = import.meta.env.VITE_BANNER_TEXT || 'Will you be my Valentine?';

// Generate a name-hint puzzle like "A _ _ _ _ _ _ S _ _ _ _ A" from a full name.
// Shows the first letter, last letter, and the first letter of each word.
export function generateNameHint(fullName) {
  const words = fullName.split(/\s+/);
  const combined = words.map(w => w.toUpperCase()).join('');
  const wordStarts = new Set();
  let pos = 0;
  for (const word of words) {
    wordStarts.add(pos);
    pos += word.length;
  }

  let hint = '';
  for (let i = 0; i < combined.length; i++) {
    if (i === 0 || i === combined.length - 1 || wordStarts.has(i)) {
      hint += combined[i];
    } else {
      hint += '_';
    }
    if (i < combined.length - 1) hint += ' ';
  }
  return hint;
}
