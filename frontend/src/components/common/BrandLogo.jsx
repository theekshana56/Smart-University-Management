import defaultLogo from "../../Assests/logo 2.jpg";

export default function BrandLogo({
  className = "",
  src = defaultLogo,
  alt = "SmartCampus logo",
}) {
  return (
    <div className={`brandLogo ${className}`.trim()}>
      <div className="brandLogoMark" aria-hidden="true">
        <img src={src} alt={alt} className="brandLogoImg" />
      </div>
    </div>
  );
}

