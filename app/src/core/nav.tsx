import React from "react";
import { pathNames } from "../constants/routes";
import { useNavigate } from "react-router-dom";

const Nav = (): React.JSX.Element => {
  return (
    <div className="navbar bg-primary text-primary-content drop-shadow-xl font-mono">
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Nimble AB</a>
      </div>
    </div>
  );
};
export default Nav;
