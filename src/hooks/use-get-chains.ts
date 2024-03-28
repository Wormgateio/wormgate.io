import { useSearchParams } from "next/navigation"
import ChainStore from "../store/ChainStore"
import { Bridge } from "../common/enums/Bridge"
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName"

export const useGetChains = () => {
    const searchParams = useSearchParams()

    return () => {
        const isHyperlaneBridge = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

        ChainStore.getChains(isHyperlaneBridge ? Bridge.Hyperlane : Bridge.LayerZero)
    }
}