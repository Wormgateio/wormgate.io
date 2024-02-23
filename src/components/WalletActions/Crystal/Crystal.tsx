import Image from "next/image";
import cn from './Crystal.module.scss';

export const Crystal = ({ number }: { number: number }) => {
    return (
        <div className={cn.crystal}>
            <Image className={cn.crystalMain} src={`/svg/crystals/${number}.svg`} alt="" width={42} height={41} />
            <Image className={cn.crystalHover} src={`/svg/crystals/${number}hover.svg`} alt="" width={42} height={41} />
        </div>
    )
}