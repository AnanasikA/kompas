/**
 * Settings of the public test version.
 *
 * FEEDBACK: the "Uwagi" tab on every screen. A tester writes a note, presses
 * "Wyślij uwagę" and it arrives in the inbox below, together with the screen,
 * mode and device it was written on.
 *
 * The app has no server of its own yet, so the note travels through
 * FormSubmit (formsubmit.co), a free form-to-e-mail service. The very first
 * note sent from a given site makes FormSubmit send an "Activate" e-mail to
 * the address; nothing is delivered until that link is clicked.
 * The address is visible to anyone who inspects the app.
 * Turn `enabled` off for the public launch, or replace this with a real form.
 */
export const FEEDBACK = {
  enabled: true,
  email: "anastasiia.kupriianets@outlook.com",
  /** Where the note is posted; the address above is appended. */
  endpoint: "https://formsubmit.co/ajax/",
};
