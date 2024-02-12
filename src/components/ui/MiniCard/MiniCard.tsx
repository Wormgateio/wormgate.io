import { ReactNode } from "react";
import cn from './MiniCard.module.scss';

interface MiniCardProps {
    children: ReactNode;
    title: string;
}

export default function MiniCard({ children, title }: MiniCardProps) {
    return (
        <div>
            <div className={cn.title}>{title}</div>
            <div>{children}</div>
        </div>
    )
}