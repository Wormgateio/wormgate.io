import styles from './Card.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Spin } from 'antd';

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  afterCard?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export default function Card({ title, children, className, afterCard, isLoading }: CardProps) {
  return (
    <div
      className={clsx(styles.card, className, {
        [styles.loading]: isLoading,
      })}
    >
      {title && (
        <div className={styles.cardHead}>
          <div className={styles.cardHeadTitle}>{title}</div>
        </div>
      )}

      <div className={styles.cardBody}>{children}</div>

      {afterCard}

      {isLoading && (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
