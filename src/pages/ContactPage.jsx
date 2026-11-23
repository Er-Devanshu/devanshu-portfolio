import { site } from "../lib/content";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SmartLink from "../components/ui/SmartLink";
import SignalField from "../components/ui/SignalField";
import usePageTitle from "../hooks/usePageTitle";
import "./ContactPage.css";

// Opens the visitor's email app with the subject already filled in.
const mailto = (subject) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export default function ContactPage() {
  usePageTitle(site.contact.title);
  const linkedin = site.socials.find((s) => s.icon === "linkedin");
  const others = site.socials.filter((s) => s !== linkedin);
  const topics = site.contact.topics || [];

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <SignalField />
      <div className="container contact-grid">
        <div className="contact-copy">
          <h1 id="contact-title">{site.contact.title}</h1>
          <p className="contact-lead">{site.contact.text}</p>
          <div className="btn-row">
            {linkedin && <Button to={linkedin.url} iconLeft="linkedin">Message on {linkedin.label}</Button>}
            <Button to={`mailto:${site.email}`} variant="secondary" iconLeft="mail" icon={null}>Email me</Button>
          </div>
          {others.length > 0 && (
            <ul className="contact-socials" aria-label="Other profiles">
              {others.map((s) => (
                <li key={s.label}>
                  <SmartLink to={s.url} className="contact-social">
                    <Icon name={s.icon} size={18} />
                    <span>{s.label}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {topics.length > 0 && (
          <aside className="contact-topics" aria-labelledby="topics-title">
            <h2 id="topics-title">{site.contact.topicsTitle}</h2>
            <ul>
              {topics.map((t) => (
                <li key={t.label}>
                  <a href={mailto(t.subject)} className="contact-topic">
                    <span className="contact-topic-text">
                      <strong>{t.label}</strong>
                      {t.hint && <span>{t.hint}</span>}
                    </span>
                    <Icon name="arrow" size={20} className="contact-topic-arrow" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="contact-topics-note">Each option opens your email app with the subject filled in.</p>
          </aside>
        )}
      </div>
    </section>
  );
}
