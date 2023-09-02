import React from 'react';
import { pathNames } from '../constants/routes';
import { Link } from 'react-router-dom';

const Nav = (): React.JSX.Element => {
  return (
    <div className="navbar bg-primary text-primary-content drop-shadow-xl font-mono">
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Nimble AB
        </Link>
      </div>
    </div>
  );
};
export default Nav;
