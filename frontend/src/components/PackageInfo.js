import React from "react";
import "./PackageInfo.css";
import { Link, useParams, useRouteMatch } from "react-router-dom";

function PackageInfo({ data, names }) {
  const { name } = useParams();
  const { url } = useRouteMatch();
  const pkg = data.find((p) => p.name === name);

  // Title component
  const Title = () => {
    return (
      <div className="section">
        <h2>{pkg.name}</h2>
      </div>
    );
  };

  // PackageLink component
  const PackageLink = ({ name, children }) => {
    if (!names.includes(name)) {
      return <span>{children}</span>;
    }
    const p = url.substr(0, url.lastIndexOf("/"));
    return <Link to={`${p}/${name}`}>{children}</Link>;
  };

  // Dependencies component
  const Dependencies = () => {
    const { dependencies } = pkg;
    if (dependencies.length === 0) {
      return null;
    }
    return (
      <div className="section">
        <div className="section-title">Dependencies</div>
        <ul>
          {dependencies.map((item) => (
            <li key={item.main}>
              <PackageLink name={item.main}>{item.main}</PackageLink>
              {item.alternatives.map((name) => (
                <React.Fragment key={name}>
                  {" | "}
                  <PackageLink name={name}>{name}</PackageLink>
                </React.Fragment>
              ))}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // ReverseDependencies component
  const ReverseDependencies = () => {
    const { dependentPackages } = pkg;
    if (dependentPackages.length === 0) {
      return null;
    }

    return (
      <div className="section">
        <div className="section-title">Dependent packages</div>
        <ul>
          {dependentPackages.map((name) => (
            <li key={name}>
              <PackageLink name={name}>{name}</PackageLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Description component
  const Description = () => {
    return (
      <div className="section">
        <div className="section-title">Description</div>
        <div className="description">{pkg.description}</div>
      </div>
    );
  };

  // Details component
  const Details = () => {
    if (!pkg) {
      return <h2>Package doesn't exist</h2>;
    }
    return (
      <>
        <Title></Title>
        <Description></Description>
        <Dependencies></Dependencies>
        <ReverseDependencies></ReverseDependencies>
      </>
    );
  };

  return (
    <div className="package-info">
      <Details />
    </div>
  );
}

export default PackageInfo;
