import React from 'react';
import styles from './nav.module.css';
import * as data from './links.json';

const linksString = JSON.stringify(data);
const links = JSON.parse(linksString).links;

type Link = {
  label: string;
  href: string;
};

const Links: React.FC<{ links: Link[] }> = ({ links }) => {
  return (
    <>
      <div className={styles['links-container']}>
        {links.map((link: Link) => {
          return (
            <div key={link.href} className={styles['link']}>
              <a href={link.href}>{link.label}</a>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Nav: React.FC<{}> = () => {
  return (
    <nav className={styles['navbar']}>
      <div className={styles['logo-container']}>
        <span className={styles['logo']}>
          {' '}
          <a href=" /home">
            <h3>Wildfire & Air Quality Tracker</h3>
          </a>
        </span>
      </div>
      <Links links={links} />
    </nav>
  );
};

export default Nav;
