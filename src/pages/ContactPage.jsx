import { site, portraitSrcSet, PORTRAIT_SIZES } from "../lib/content";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SmartLink from "../components/ui/SmartLink";
import CvButton from "../components/ui/CvButton";
import SignalField from "../components/ui/SignalField";
import usePageTitle from "../hooks/usePageTitle";
import "./ContactPage.css";

export default function ContactPage() {
  usePageTitle(site.contact.title);
  const linkedin = site.socials.find((s) => s.icon === "linkedin");
  const others = site.socials.filter((s) => s !== linkedin);

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
            <CvButton />
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
        {site.contactPhoto && (
          <figure className="contact-media portrait-card">
            <img src={site.contactPhoto} srcSet={portraitSrcSet(site.contactPhoto, site.contactPhotoSmall)} sizes={PORTRAIT_SIZES} alt={site.contactPhotoAlt || site.name} width="1199" height="1312" fetchPriority="high" />
          </figure>
        )}
      </div>
    </section>
  );
}
