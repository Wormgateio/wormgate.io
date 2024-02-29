import Image from 'next/image';
import styles from './Footer.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Divider } from 'antd';

interface FooterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

function FooterLink({ href, children, className }: FooterLinkProps) {
  return (
    <a href={href} target="_blank" className={clsx(styles.link, className)}>
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.socials}>
        <FooterLink href="https://twitter.com/Womex_io">
          <Image src="/svg/socials/twitter.svg" width={28} height={28} alt="Twitter" />
          <span className={styles.text}>Twitter</span>
        </FooterLink>

        <FooterLink href="https://womex.gitbook.io/womex/">
          <Image src="/svg/socials/gitbook.svg" width={28} height={28} alt="GitBook" />
          <span className={styles.text}>GitBook</span>
        </FooterLink>

        <FooterLink href="https://medium.com/@womex.io">
          <Image src="/svg/socials/medium.svg" width={28} height={28} alt="Medium" />
          <span className={styles.text}>Medium</span>
        </FooterLink>
      </div>

      <Divider className={styles.divider} />

      <FooterLink className={styles.poweredBy} href="https://layerzero.network/">
        <span className={styles.poweredByText}>Powered by</span>
        <Image src="/svg/layer-zero.svg" width={111} height={30} alt="Layer Zero" />
      </FooterLink>
    </div>
  );
}
