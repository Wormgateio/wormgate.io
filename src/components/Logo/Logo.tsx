import clsx from 'clsx';
import styles from './Logo.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  imageClassName?: string;
  withCompanyName?: boolean;
}

export default function Logo({ imageClassName, withCompanyName = true }: Props) {
  if (withCompanyName) {
    return (
      <h1 className={styles.logo}>
        <Link href="/">
          <Image
            className={clsx(styles.imageWithText, imageClassName)}
            priority={true}
            src="/svg/logo.svg"
            width={203}
            height={60}
            alt="Womex"
          />
        </Link>
      </h1>
    );
  }

  return (
    <Link href="/">
      <Image
        className={clsx(styles.image, imageClassName)}
        priority={true}
        src="/svg/companyLogo.svg"
        width={203}
        height={60}
        alt="Womex"
      />
    </Link>
  );
}
