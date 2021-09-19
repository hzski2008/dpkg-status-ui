import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import PackageInfo from "./components/PackageInfo";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [linkList, setLinkList] = useState(null);
  const [packageNames, setPackageNames] = useState([]);

  let API_ENDPOINT;
  if (process.env.NODE_ENV === "production") {
    API_ENDPOINT = "/api/packages";
  } else {
    API_ENDPOINT = "http://localhost:4000/api/packages"; // could be replaced using .env file
  }

  useEffect(() => {
    const handleErrors = (resp) => {
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      return resp;
    };

    // get the list of package info from backend
    const fetchData = () => {
      fetch(`${API_ENDPOINT}`)
        .then(handleErrors)
        .then((response) => response.json())
        .then((pkgs) => {
          setPackages(pkgs);
          setIsLoading(false);
        })
        .catch((error) => {
          throw error;
        });
    };
    fetchData();
  }, []);

  // get the list of package names
  const getNames = (pkgs) => {
    return pkgs.reduce((names, item) => {
      return [...names, item.name];
    }, []);
  };

  const getLinkList = (pkgs) => {
    return pkgs.map((pkg) => {
      return (
        <li key={pkg.name}>
          <Link to={`/packages/${pkg.name}`}>{pkg.name}</Link>
        </li>
      );
    });
  };

  const handlePackagesChange = useCallback(() => {
    setLinkList(getLinkList(packages));
    setPackageNames(getNames(packages));
  }, [packages]);

  useEffect(() => {
    handlePackagesChange();
  }, [handlePackagesChange]);

  const ascCompare = (first, second) => {
    const a = first.name;
    const b = second.name;

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortAsc = () => {
    setPackages(prevState => {
       return [...prevState].sort((a, b) => ascCompare(a, b));
    });
  };

  /* --- Descending order sorting --- */
  const sortDesc = () => {
    setPackages(prevState => [...prevState].sort((a, b) => ascCompare(b, a)));
  };

  // Package component
  const Packages = () => {
    return (
      <Router>
        <div className="container">
          <div className="sidebar">
            <h3>Packages</h3>
            <button className='sort-asc' onClick={sortAsc}>
        Sort A-Z
      </button>
      <button className='sort-desc' onClick={sortDesc}>
        Sort Z-A
      </button>
            <ul className="sidebar-list"> {linkList}</ul>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/packages">
                <p>Please select a package</p>
              </Route>
              <Route path="/packages/:name">
                <PackageInfo data={packages} names={packageNames} />
              </Route>
              <Redirect to="/packages" />
            </Switch>
          </div>
        </div>
      </Router>
    );
  };

  return <>{isLoading ?<> <div>Loading...</div><LoadingSpinner /> </>: <Packages></Packages>}</>;
}

export default App;
