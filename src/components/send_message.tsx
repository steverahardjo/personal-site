export default function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST"
      className="flex flex-col gap-3"
    >
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Your email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send</button>
    </form>
  );
}
